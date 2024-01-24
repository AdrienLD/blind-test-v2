/**
 * @type {[string, string[]][]}
 */

export const playlist = [
    [ 'Années' , ['50', '60', '70', '80', '90', '2000', '2010', '2020', '2023'] ],
    [ 'Genres' , ['Rock', 'Pop', 'Rap', 'RnB', 'Classique', 'Jazz', 'Monde'] ],
    [ 'Artistes' , ['Imagine Dragons', 'Steel Panther', 'Ghost', 'Lady Gaga'] ],
    [ 'Télévision' , ['Films', 'Gen Séries TV', 'Dessins animés', 'Anime OST', 'Disney', "Films d'animation", 'Jeux Vidéos', 'Publicités'] ],
    [ 'Langues' , ['Chanson française', 'Rock Français', 'Rap Français'] ],
    [ 'Ajouter' , ['Ajouter une playlist'] ]
]

export async function getSpotifyToken() {
    console.log(window.location.search.split('=')[1])
    try {
        const response = await fetch('http://localhost:4000/api/gettoken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: window.location.search.split('=')[1]
            })
        });
        console.log('response token')
    } catch (error) {
        console.error('Erreur lors de l\'échange du code:', error);
        throw error; // Propager l'erreur pour pouvoir la gérer dans listemusiques
    }
}
