// Vite alias target for the optional "@recast-navigation/*" imports that
// babylonjs-editor-tools references inside its navmesh preload plugin.
// We do not use navmesh script assets, so this stub only needs to exist
// for the module graph to resolve. It exports an empty namespace on purpose.
export default {};
