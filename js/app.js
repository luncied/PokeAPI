import { searchPokemon, getOptData, loadPokemons, getData } from "../js/fun.js"
import { searchForm, resultCont, showMoreBtn } from "../js/var.js"
import clearHTML from '../helpers/clearHTML.js';

let pokemons;
let nextPage;

// Event Listener que carga los poquemones al iniciar la pagina
document.addEventListener('DOMContentLoaded', async () => {
    // getOptData(searchForm[5], 'type');
    // getOptData(searchForm[7], 'generation'); // generation ix doesn't work
    const selector = resultCont;
    // Elimina los elementos viejos en caso de que se haga una nueva busqueda en la pestaña search 
    clearHTML(selector);
    pokemons = await loadPokemons();
    nextPage = pokemons.next;
});

// Event Listener que escucha al boton mostrar màs para mostrar màs pokemons
showMoreBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    pokemons = await loadPokemons(nextPage);
    nextPage = pokemons.next;
    console.log(pokemons);
});

// searchForm.elements["search-btn"].addEventListener('click', (e) => {
//     e.preventDefault();
//     const pokemon = searchForm.elements["poke-name"].value;
//     pokemon ? searchPokemon(pokemon) : console.error('Ingrese un nombre de pokemon valido');
// });



