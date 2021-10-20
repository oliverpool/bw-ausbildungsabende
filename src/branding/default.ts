export default {
  vue: {
    title: 'Ausbildungsabende - Bergwacht Bad Tölz',
    new_training: 'Neuer Ausbildungsabend',
    create_training: 'Ausbildungsabend erstellen',
    last_trainings: 'Letzte Ausbildungsabende',
    members: 'Einsatzkräfte',
    add_member_list: 'Einsatzkraft-Liste hinzufügen',
    import_member_list: 'Einsatzkräfte importieren',
    types: {
      AW: 'Anwärter',
      AEK: 'Aktive Einsatzkraft',
      JG: 'Jugendgruppe',
      KB: 'Kein Bereitschaftdienst',
      '×': 'Nicht mehr dabei',
    } as { [key: string]: string },
    new_member: 'Neue Einsatzkraft',
    type: 'Ausbildung',
    attends_training: 'Anwesend an diesem Ausbildungsabend',
    save_member: 'Einsatzkraft speichern',
    exportFilename: 'Ausbildungsabende',
  },
  html: {
    class: 'bg-blue-bw',
    title: 'Ausbildungsabende - Bergwacht Bad Tölz',
    description: 'Anwesenheitsliste für die Ausbildungsabende der Bergwacht Bad Tölz',
    themecolor: '#0088ce',
  },
  pwaConfig: {
    includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'safari-pinned-tab.svg'],
    manifest: {
      name: 'Anwesenheit - Ausbildungsabende - Bergwacht Bad Tölz',
      short_name: 'Anwesenheit',
      description: 'Anwesenheitsliste für die Ausbildungsabende der Bergwacht Bad Tölz',
      theme_color: '#0088ce',
      background_color: '#0088ce',
      lang: 'de',
      start_url: '', // to preserve URL-query
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
  },
}
