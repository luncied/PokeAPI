import { searchPokemon, getOptData, loadPokemons } from "../js/fun.js"
import { searchForm, resultCont, showMoreBtn } from "../js/var.js"
import clearHTML from '../helpers/clearHTML.js';

let pokemons;
let nextPage;

document.addEventListener('DOMContentLoaded', async () => {
    // getOptData(searchForm[5], 'type');
    // getOptData(searchForm[7], 'generation'); // generation ix doesn't work
    const selector = resultCont;
    // Elimina los elementos viejos en caso de que se haga una nueva busqueda en la pestaña search 
    clearHTML(selector);
    pokemons = await loadPokemons();
    nextPage = pokemons.next;

});

searchForm.elements["search-btn"].addEventListener('click', (e) => {
    e.preventDefault();
    const pokemon = searchForm.elements["poke-name"].value;
    pokemon ? searchPokemon(pokemon) : console.error('Ingrese un nombre de pokemon valido');
});

showMoreBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    console.log(pokemons);
    console.log(nextPage);
    pokemons = await loadPokemons(nextPage);
    nextPage = pokemons.next;
});




