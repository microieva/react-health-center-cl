import { useApolloClient, useQuery } from '@apollo/client/react';
import { 
  type DocumentNode, 
  type OperationVariables, 
  type TypedDocumentNode,
  // type ApolloError,
  // type QueryResult
} from '@apollo/client';
import { useCallback, useState, useEffect } from 'react';

// Utility types for extracting data and variables from TypedDocumentNode
type ExtractData<T> = T extends TypedDocumentNode<infer D, any> ? D : any;
type ExtractVariables<T> = T extends TypedDocumentNode<any, infer V> ? V : OperationVariables;

// Type guard to check if query is TypedDocumentNode
function isTypedDocumentNode<TData, TVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>
): query is TypedDocumentNode<TData, TVariables> {
  return 'result' in query || 'variables' in query;
}

interface UseCacheOptions<TData = any, TVariables = OperationVariables> {
  variables?: TVariables extends OperationVariables ? TVariables : OperationVariables;
  fetchPolicy?: 'cache-first' | 'network-only' | 'cache-only' | 'no-cache' | 'standby';
  skip?: boolean;
  onCompleted?: (data: TData) => void;
  onError?: (error: any) => void;
}

interface UseCacheResult<TData, TVariables> {
  data: TData | null;
  loading: boolean;
  error: any;
  getCachedData: () => TData | null;
  refetch: (variables?: Partial<TVariables>) => Promise<TData | null>;
  isCached: boolean;
  clearCache: () => void;
}

export function useCache<TData = any, TVariables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options: UseCacheOptions<TData, TVariables> = {}
): UseCacheResult<TData, TVariables> {
  const client = useApolloClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [isCached, setIsCached] = useState<boolean>(false);
  const [cachedData, setCachedData] = useState<TData | null>(null);

  const { 
    variables, 
    fetchPolicy = 'cache-first',
    skip = false,
    onCompleted,
    onError 
  } = options;

  // Read from cache
  const getCachedData = useCallback((): TData | null => {
    try {
      // Cast variables to any for cache operations
      const result = client.readQuery({
        query: query as DocumentNode,
        variables: variables as any,
      });
      
      if (result) {
        setIsCached(true);
        setCachedData(result as TData);
        return result as TData;
      }
      return null;
    } catch (err) {
      setIsCached(false);
      setCachedData(null);
      return null;
    }
  }, [client, query, variables]);

  // Check if data exists in cache
  const isDataCached = useCallback((): boolean => {
    try {
      const result = client.readQuery({
        query: query as DocumentNode,
        variables: variables as any,
      });
      return !!result;
    } catch (err) {
      return false;
    }
  }, [client, query, variables]);

  // Refetch data
  const refetch = useCallback(async (newVariables?: Partial<TVariables>): Promise<TData | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const mergedVariables = { ...variables, ...newVariables };
      
      const result = await client.query({
        query: query as DocumentNode,
        variables: mergedVariables as any,
        fetchPolicy: 'network-only',
      });
      
      if (result.data) {
        setCachedData(result.data as TData);
        setIsCached(true);
        onCompleted?.(result.data as TData);
        return result.data as TData;
      }
      return null;
    } catch (err) {
      const errorObj = err as any;
      setError(errorObj);
      onError?.(errorObj);
      return null;
    } finally {
      setLoading(false);
    }
  }, [client, query, variables, onCompleted, onError]);

  // Clear cache
  const clearCache = useCallback(() => {
    try {
      client.writeQuery({
        query: query as DocumentNode,
        variables: variables as any,
        data: null as any,
      });
      setIsCached(false);
      setCachedData(null);
    } catch (err) {
      // Ignore errors when clearing cache
    }
  }, [client, query, variables]);

  // Apollo useQuery hook
  const queryResult = useQuery<TData, OperationVariables, any>(
    query as TypedDocumentNode<TData, TVariables>,
    {
      variables: variables as TVariables,
      fetchPolicy,
      skip: skip || isCached,
      onCompleted: (data: TData) => {
        setCachedData(data);
        setIsCached(true);
        if (onCompleted) onCompleted(data);
      },
      onError: (err: any) => {
        setError(err);
        if (onError) onError(err);
      },
    }
  );

  const { loading: queryLoading, error: queryError } = queryResult;

  // Initial cache check
  useEffect(() => {
    const data = getCachedData();
    if (data) {
      setIsCached(true);
      setCachedData(data);
    }
  }, [getCachedData]);

  return {
    data: cachedData,
    loading: loading || queryLoading,
    error: error || queryError || null,
    getCachedData,
    refetch,
    isCached,
    clearCache,
  };
}

export default useCache;