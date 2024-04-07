import React, { useState, useEffect } from 'react';
import {imgHangman} from './img';
import './hangman.css';

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
        } else  if (!state.wrongLetters.includes(letter)) {
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
            if (allLettersGuessed) {
                setState(prevState => ({ ...prevState, win: true }));
            } else if (state.tries >= state.maxTries) {
                setState(prevState => ({ ...prevState, lost: true }));
            }
        }
    };

    const textResult = () => {
        if (state.win == true) {
            return <div className='endGame'><h2>🎉 Bravo ! Vous avez gagné ! 🎉</h2><button onClick={restartGame}>Nouvelle Partie</button></div>;
        } else if (state.lost == true) {
            return <div className='endGame'><h2>Perdu ! Le mot était : {state.word}</h2><button onClick={restartGame}>Nouvelle Partie</button></div>;
        }
        else {
            return '';
        }
    }

    // Nouvelle partie
    const restartGame = () => {
        window.location.reload();
    };

    useEffect(() => {
        recupWord();
    }, []);


    return (
        <div>
            <h1>Le pendu</h1>
            <h2>Mythologie en anglais</h2>
            <div className='things'>
                <button onClick={restartGame}>Recommencer</button>
                <p>Essais restants : {state.maxTries - state.tries}</p>
            </div>
            <div className='content'>
                <div className='img'>
                    {imgHangman({tries: state.tries})}
                </div>
                <div className='sectionWord'>
                    <p>Problème, la popup de victoire s'affiche une fois sur 3...</p>
                    <p className='maskWord'>{maskWord()}</p>

                    <form onSubmit={guessLetters}>
                        <label htmlFor="letter">Entrez une lettre : </label>
                        <div>
                            <input type="text" id="letter" name="letter" maxLength="1" value={inputValue} onChange={e => setInputValue(e.target.value)} />
                            <button type="submit">Valider</button>
                        </div>
                    </form>

                    <p className='wrongLetters'>Mauvaises lettres : <br />{state.wrongLetters} </p>
                </div>
            </div>

            {textResult()}

        </div>
    );
}
