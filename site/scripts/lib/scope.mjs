// Which site pages exist in this build. The pipeline parses and validates the whole knowledge base,
// but pages are published step by step (WEBSITE_BUILD_PROMPT.md, Process §2): the Weimar slice first,
// then the rollout. Cross-references to pages not yet built render as plain (unlinked) file names.
export const BUILT_ERAS = ['weimar-republic'];

export const BUILT_PAGES = [...BUILT_ERAS.map((s) => `/eras/${s}/`), '/eras/', '/dictionary/', '/how-we-know/', '/how-we-know/audit/'];
