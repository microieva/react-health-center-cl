import { capitalize } from "@mui/material"

export const PageFooter = ({role}: {role:string}) => {
  return (
    <div className="mt-8 text-center">
      <p className="text-xs" style={{ color: '#94a3b8' }}>
        © 2026 Health Center {capitalize(role)} Panel. All rights reserved. v1.0.0
      </p>
    </div>
  )
}