import React, { useState, useEffect } from 'react';

export const Hangman = () => {
    const [inputValue, setInputValue] = useState('');
    const [state, setState] = useState({
        word: '',
        rightLetters: [],
        wrongLetters: [],
        tries: 0,
        maxTries: 11,
        win: false,
        lost: false
    });

    useEffect(() => {   
        statutGame();
    }, [state.rightLetters, state.tries]);

    // Récupérer un mot aléatoire
    const recupWord = () => {
        fetch('https://node-hangman-api-production.up.railway.app/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => response.json())
        .then(data => {
            setState({
                ...state,
                word: data.word.toUpperCase(),
                rightLetters: [data.word[0]],
            });
        });
    }

    // Masquer le mot à deviner
    const maskWord = () => {
        if (state.word) {
            return state.word.split('').map((letter, index) => {
                if (index === 0 || state.rightLetters.includes(letter)) {
                    return letter;
                } else {
                    return '_';
                }
            }).join(' ')
        };
    }

    // Gérer les lettres proposées
    const guessLetters = (event) => {
        event.preventDefault();
        const letter = inputValue.toUpperCase();
        setInputValue('');
        if (state.word.includes(letter)) {
            setState({
                ...state,
                rightLetters: [...state.rightLetters, letter]
            });
        } else {
            setState({
                ...state,
                wrongLetters: [...state.wrongLetters, letter],
                tries: state.tries + 1
            });
        }
    }

    // Gérer la fin de la partie
    const statutGame = () => {
        if (state.word) {
            const allLettersGuessed = state.word.split('').every(letter => state.rightLetters.includes(letter));
            if (state.word && allLettersGuessed) {
                setState(prevState => ({ ...prevState, win: true }));
            } else if (state.tries >= state.maxTries) {
                setState(prevState => ({ ...prevState, lost: true }));
            }
        }
    };

    const textResult = () => {
        if (state.win == true) {
            return <div><p>Bravo, vous avez gagné !</p><button onClick={restartGame}>Nouvelle Partie</button></div>;
        } else if (state.lost == true) {
            return <p>Perdu ! Le mot était : {state.word}</p>;
        }
        else {
            return '';
        }
    }

    // Nouvelle partie
    const restartGame = () => {
        window.location.reload();
        /*setState({ 
            word: '',
            rightLetters: [], 
            wrongLetters: [], 
            tries: 0,
            maxTries: 11, 
            win: false, 
            lost: false 
        });
        recupWord();*/ 
    };

    useEffect(() => {
        recupWord();
    }, []);


    return (
        <div>
            <h2>Le pendu</h2>
            <p>bouh  {state.word}</p>
            <p>Le mot à deviner est : {maskWord()}</p>

            <form onSubmit={guessLetters}>
                <label htmlFor="letter">Entrez une lettre : </label>
                <input type="text" id="letter" name="letter" maxLength="1" value={inputValue} onChange={e => setInputValue(e.target.value)} />
                <button type="submit">Valider</button>
            </form>

            <p>Mauvaises lettres : {state.wrongLetters} </p>
            <p>Essais restants : {state.maxTries - state.tries}</p>

            <button onClick={restartGame}>Recommencer</button>

            {textResult()}

        </div>
    );
}
