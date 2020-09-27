class Usuarios {

    constructor() {

        this.personas = [];

    }

    agregarPersona(id, nombre, sala) {

        let persona = { id, nombre, sala };

        this.personas.push(persona);

        return this.personas;

    }

    getPersona(id) {

        //Si encuentra alguien sólo retorna 1 registro [0]
        let persona = this.personas.filter(per => {

            return per.id === id;

        })[0];

        return persona;

    }


    getTodasLasPersonas() {
        return this.personas;
    }


    getPersonasPorSala(sala) {

        let personasEnSala = this.personas.filter(persona => {
            return persona.sala === sala;
        });

        return personasEnSala;

    }


    borrarPersona(id) {

        let personaBorrada = this.getPersona(id);

        this.personas = this.personas.filter(per => {

            return per.id != id

        });


        return personaBorrada;

    }
}


module.exports = {

    Usuarios

}