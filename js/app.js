import { searchPokemon, getOptData, loadPokemons, loadCards } from "../js/fun.js"
import { searchForm, resultCont, showMoreBtn, } from "../js/var.js"
import clearHTML from '../helpers/clearHTML.js';

let pokemons;
let pages;
let countPages = 1;

// Event Listener que carga los poquemones al iniciar la pagina
document.addEventListener('DOMContentLoaded', async () => {
    // getOptData(searchForm[5], 'type');
    // getOptData(searchForm[7], 'generation'); // generation ix doesn't work
    const selector = resultCont;
    // Elimina los elementos viejos en caso de que se haga una nueva busqueda en la pestaña search 
    clearHTML(selector);
    pokemons = await loadPokemons();
});

// Event Listener que escucha al boton mostrar màs para mostrar màs pokemons
showMoreBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    pages = pokemons.results.length;

    try {
        if(countPages < Math.ceil(pages/30)){
            loadCards(pokemons.results.slice((countPages*30), ((countPages+1)*30)));
            showMoreBtn.classList.remove("disabled");
            countPages++;
        } else {
            showMoreBtn.classList.add("disabled");
        }
    } catch {
        console.error("Error al cargar el resto de tarjetas, contactar a soporte");
    }
});

searchForm.elements["search-btn"].addEventListener('click', async (e) => {
    e.preventDefault();
    try{
        const pokemon = searchForm.elements["poke-name"].value;
        const searchedPokemons = searchPokemon(pokemons, pokemon);

        clearHTML(resultCont);
        if(!pokemon){
            clearHTML(resultCont);
            await loadCards(pokemons.results.slice(0, 30));
            showMoreBtn.classList.remove("disabled");
        } else {
            await loadCards(searchedPokemons);
            showMoreBtn.classList.add("disabled");
        };

    } catch {
        console.error("Contacte a soporte");
    }

});
