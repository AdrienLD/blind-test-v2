export interface PlaylistItem {
  name: string
  id: string
}

export interface PlaylistCategories {
  [key: string]: PlaylistItem[]
}

export const playlist2: PlaylistCategories[] = [
  {
    'Années': [
      { name: '60', id: '37i9dQZF1DX7Uol5MpckMS' },
      { name: '70', id: '37i9dQZF1DX7LGssahBoms' },
      { name: '80', id: '37i9dQZF1DWWl7MndYYxge' },
      { name: '90', id: '37i9dQZF1DWWGI3DKkKGzJ' },
      { name: '2000', id: '37i9dQZF1DXacPj7eARo6k' },
      { name: '2010', id: '37i9dQZF1DX8E06AbSENEw' }
    ],
    'Genres': [
      { name: 'Rock', id: '37i9dQZF1EQpj7X7UK8OOF' },
      { name: 'Pop', id: 'https://open.spotify.com/playlist/37i9dQZF1DWXRqgorJj26U?si=b9741e92e13d40d2' },
      { name: 'Rap', id: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd?si=7584f7f9b126443f' },
      { name: 'RnB', id: '37i9dQZF1DX2UgsUIg75Vg' },
      { name: 'Classique', id: '37i9dQZF1DWWEJlAGA9gs0' },
      { name: 'Jazz', id: '37i9dQZF1DXbITWG1ZJKYt' },
      { name: 'Monde', id: '37i9dQZF1DX4JAvHpjipBk' }
    ]
  }
]