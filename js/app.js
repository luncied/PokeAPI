import { searchPokemon, getOptData } from "../js/fun.js"
import { searchForm, resultCont } from "../js/var.js"

document.addEventListener('DOMContentLoaded',() => {
    // getOptData(searchForm[5], 'type');
    // getOptData(searchForm[7], 'generation'); // generation ix doesn't work
    searchPokemon();
});

searchForm.elements["search-btn"].addEventListener('click', (e) => {
    e.preventDefault();
    const pokemon = searchForm.elements["poke-name"].value;
    pokemon ? searchPokemon(pokemon) : console.error('Ingrese un nombre de pokemon valido')
});
