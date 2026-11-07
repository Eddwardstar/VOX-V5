// Módulo reservado para ambientes 3D Three.js.
// A versão inicial usa cenas CSS leves; a integração 3D completa pode ser adicionada sem
// misturar renderização 3D com autenticação, mapa ou progresso.
export function initThreeScenes() {
  return { enabled: false, reason: "Cenas 3D serão adicionadas em uma etapa própria." };
}
