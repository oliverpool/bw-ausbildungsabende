import branding from './default'

branding.vue = {
  ...branding.vue,
  title: 'Gruppenstunden - DPSG',
  new_training: 'Neue Gruppenstunde',
  create_training: 'Gruppenstunde erstellen',
  last_trainings: 'Letzte Gruppenstunden',
  members: 'Grüpplinge',
  add_member_list: 'Grüppling-Liste hinzufügen',
  import_member_list: 'Grüpplinge importieren',
  types: {
    S: 'Schnupper',
    M: 'Mitglied',
    '×': 'Nicht mehr dabei',
  } as { [key: string]: string },
  new_member: 'Neuer Gruppling',
  type: 'Mitgliedschaft',
  attends_training: 'Anwesend an dieser Gruppenstunde',
  save_member: 'Gruppling speichern',
  exportFilename: 'Gruppenstunden',
}
branding.html = {
  ...branding.html,
  class: 'bg-blue-dpsg',
  title: 'Gruppenstunden - DPSG',
  description: 'Anwesenheitsliste für die Gruppenstunden der DPSG',
  themecolor: '#1A305B',
}
branding.pwaConfig.manifest = {
  ...branding.pwaConfig.manifest,
  name: 'Anwesenheit - Gruppenstunden - DPSG',
  short_name: 'Anwesenheit - Gruppenstunden - DPSG',
  description: 'Anwesenheitsliste für die Gruppenstunden der DPSG',
  theme_color: '#1A305B',
  background_color: '#1A305B',
}

export default branding
