interface ImportMetaEnv {
  readonly VITE_ISSUANCE_URL: string
  readonly VITE_VERIFICATION_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
