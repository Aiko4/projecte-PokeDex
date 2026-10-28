// ==========================================================
// EXERCICI 1: Llistar els 151 Pokémon
// ==========================================================
// TODO: Implementa la lògica de l'exercici 1 seguint els requisits
import * as Models from "./models.js";
import { BasePokemon } from "./models.js";
import * as Utils from "./utils.js";
Utils.generarBotonsTipus();
const mapaPokemon = new Map();
let llistaPokemons = [];
let btnCarregar = document.getElementById("btn-show-all");
let filterBox = document.querySelector(".search-box");
btnCarregar.addEventListener("click", carregarLlistaPokemon);
filterBox.addEventListener("input", filtrar);
let containerTipus = document.getElementById("type-filter-container");
let btnDesactivar;
for (let btn of containerTipus.children) {
    btn.addEventListener("click", event => {
        if (btnDesactivar != undefined) {
            btnDesactivar.classList.remove("active");
        }
        let btnSeleccionat = event.currentTarget;
        btnDesactivar = btnSeleccionat;
        let tipus = btnSeleccionat.dataset.type;
        btnSeleccionat.classList.add("active");
        carregarPokemonPerTipus(tipus);
    });
}
async function carregarPokemonPerTipus(tipus) {
    Utils.mostrarEstat("Carregant pokemons de tipus " + tipus + "...", "loading");
    try {
        const resposta = await fetch(`https://pokeapi.co/api/v2/type/${tipus}`);
        if (!resposta.ok) {
            throw new Error(`Error HTTP: ${resposta.status}`);
        }
        else {
            const result = await resposta.json();
            let arrayPokemons = result.pokemon;
            let llistaPokemonsSeleccionats = [];
            mapaPokemon.clear();
            for (let pokemon of arrayPokemons) {
                if (Number(pokemon.pokemon.url.split("/").filter(Boolean).pop()) < 151) {
                    let pokemonNou = new BasePokemon(pokemon.pokemon);
                    mapaPokemon.set(Number(pokemon.pokemon.url.split("/").filter(Boolean).pop()), pokemonNou);
                    llistaPokemonsSeleccionats = Array.from(mapaPokemon.values());
                }
            }
            Utils.renderitzarLlistaNoms(llistaPokemonsSeleccionats);
            Utils.netejarCercador();
            Utils.netejarDetallCard();
            Utils.amagarEstat();
        }
    }
    catch {
        Utils.mostrarEstat("S'ha produit el següent error: ", "error");
    }
}
async function carregarLlistaPokemon() {
    Utils.netejarCercador();
    Utils.mostrarEstat("Carregant llista de pokemons...", "loading");
    try {
        const resposta = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        if (!resposta.ok) {
            throw new Error(`Error HTTP: ${resposta.status}`);
        }
        else {
            const results = await resposta.json();
            for (let r of results.results) {
                let pokemon = new BasePokemon(r);
                mapaPokemon.set(pokemon.id, pokemon);
                llistaPokemons = Array.from(mapaPokemon.values());
            }
            Utils.renderitzarLlistaNoms(llistaPokemons);
            Utils.amagarEstat();
        }
    }
    catch {
        Utils.mostrarEstat("S'ha produit el següent error: ", "error");
    }
}
function filtrar() {
    let llistaPokesFiltrats = [];
    let inputSearchBox = document.getElementById("search-input").value.toLowerCase().trim();
    let esNumero = Number(inputSearchBox); // passem el input a numero en una variable temporal
    if (inputSearchBox === "") {
        Utils.renderitzarLlistaNoms(llistaPokemons);
    }
    else if (!isNaN(esNumero)) { // comprovem si el suposat numero que s'ha passat per input es realment un numeric
        llistaPokesFiltrats = llistaPokemons.filter(pokemonFiltrat => pokemonFiltrat.id === esNumero);
        Utils.renderitzarLlistaNoms(llistaPokesFiltrats);
    }
    else { // l'input es typeof string
        llistaPokesFiltrats = llistaPokemons.filter(pokemonFiltrat => pokemonFiltrat.name.includes(inputSearchBox));
        Utils.renderitzarLlistaNoms(llistaPokesFiltrats);
    }
}
// ==========================================================
// EXERCICI 2: Cercador en temps real
// ==========================================================
// TODO: Implementa la lògica de l'exercici 2 seguint els requisits
// ==========================================================
// EXERCICI 3: Detall del Pokémon, cache i crit
// ==========================================================
const cachePokemon = new Map();
//Primer, capturo la llista dels pokemons .
let llistaUl = document.getElementById("pokemon-list");
if (llistaUl !== null) {
    //Sense el event, no es sabria quin element hauria clicat de la llista.
    llistaUl.addEventListener("click", (event) => {
        let pokemonEscollit = event.target;
        let itemLi = pokemonEscollit.closest("li");
        if (!itemLi || !itemLi.dataset.id) {
            return;
        }
        Utils.marcarItemActiu(itemLi);
        let idPokemon = Number(itemLi.dataset.id);
        let infoPokemon = mapaPokemon.get(idPokemon);
        if (infoPokemon) {
            carregarDetallPokemon(infoPokemon.id, infoPokemon.url);
        }
    });
}
async function carregarDetallPokemon(id, url) {
    const pokemonCache = cachePokemon.get(id);
    if (pokemonCache != null) {
        Utils.renderitzarDetallCard(pokemonCache);
        return;
    }
    try {
        Utils.mostrarEstat("Carregant dades del Pokémon...", "loading");
        const resposta = await fetch(url);
        const dadesRaw = (await resposta.json());
        const pokemonDetall = new Models.DetailedPokemon(dadesRaw, url);
        cachePokemon.set(id, pokemonDetall);
        Utils.renderitzarDetallCard(pokemonDetall);
        Utils.amagarEstat();
    }
    catch (error) {
        Utils.mostrarEstat("Error en carregar el Pokémon", "error");
    }
}
// ==========================================================
// EXERCICI 4: Botons de filtre per tipus
// ==========================================================
// ==========================================================
// EXERCICI 5: Filtrar la llista per tipus
// ==========================================================
// TODO: Implementa la lògica de l'exercici 5 seguint els requisits
//# sourceMappingURL=main.js.map