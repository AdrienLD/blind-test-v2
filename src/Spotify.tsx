import React, { useEffect, useState } from 'react';

const SpotifyCallback: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // Récupérer le code d'authentification de l'URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        console.log('Code:', code);
        if (code) {
            // Échanger le code contre un token d'accès
            fetch('http://localhost:4000/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code })
            })
                .then(response => response.json())
                .then(data => {
                    setToken(data.access_token);
                })
                .catch(error => {
                    console.error('Erreur lors de l\'échange du code:', error);
                });
        }
    }, []);

    const requireplalist = () => {
        fetch('http://localhost:4000/api/research', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titre: 'This I Love'
            })
        })
            .then(response => {
                console.log('response', response)
                return response.json();
            })
            .then(data => {
                console.log(data)
            })
            .catch(error => {
                console.error('Erreur lors de l\'échange du code:', error);
            });
    }
    


    return (
        <div onClick={ requireplalist}>
            {token ? <div>Token d'accès: {token}</div> : <div>Obtention du token...</div>}
        </div>
    );
}

export default SpotifyCallback;
