import React, { useEffect, useState } from 'react';

const SpotifyCallback: React.FC = () => {
    const accessToken = process.env.ACCESS_TOKEN;

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
            {accessToken ? <div>Token d'accès: {accessToken}</div> : <div>Obtention du token...</div>}
            <iframe title='test' src="https://open.spotify.com/embed/track/2FEWcWHnDmGD6WSqpW4VYu" width="300" height="380"  allow="encrypted-media"></iframe>

        </div>
    );
}

export default SpotifyCallback;
