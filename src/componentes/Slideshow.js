import React, { useRef, useEffect, useCallback } from 'react';
import { ReactComponent as FlechaIzquierda } from './../img/iconmonstr-angel-left-thin.svg';
import { ReactComponent as FlechaDerecha } from './../img/iconmonstr-angel-right-thin.svg';
import styled from 'styled-components';




const Slideshow = ({
    children,
    controles = false,
    autoplay = false,
    velocidad = "500",
    intervalo = "5000"
}) => {
    const slideshow = useRef(null);
    const intervaloSlideShow = useRef(null);


    //Creacion de dos funciones
    const siguiente = useCallback(() => {


        //Comprobamos que el slideshow tenga elementos
        if (slideshow.current.children.length > 0) {

            console.log('Siguiente');

            //Obtenemos el primer elemento
            const primerElemento = slideshow.current.children[0];

            //Establecemos la transicion para el slideshow
            slideshow.current.style.transition = `${velocidad}ms ease-out all`;

            const tamañoSlide = slideshow.current.children[0].offsetWidth;

            //Movemos el slideshow
            slideshow.current.style.transform = `translateX(-${tamañoSlide}px)`;

            //Creacion de una funcion
            const transicion = () => {
                //Reiniciamos la posicion del Slideshow
                slideshow.current.style.transition = 'none';
                slideshow.current.style.transform = `translateX(0)`;

                //Tomamos el primer elemento y lo mandamos al final
                slideshow.current.appendChild(primerElemento);

                slideshow.current.removeEventListener('transitionend', transicion);
            }


            //Eventlistener para cuando termina la animacion
            slideshow.current.addEventListener('transitionend', transicion);


            //console.log(slideshow.current);
            //console.log('Siguiente');



        }

    }, [velocidad]);
    


    const anterior = () => {
        console.log('Anterior');
        if (slideshow.current.children.length > 0) {
            //Obtenemos el ultimo elemento del slideshow.
            const index = slideshow.current.children.length - 1;
            const ultimoElemento = slideshow.current.children[index];
            slideshow.current.insertBefore(ultimoElemento, slideshow.current.firstChild);


            slideshow.current.style.transition = 'none';
            const tamañoSlide = slideshow.current.children[0].offsetWidth;
            slideshow.current.style.transform = `translateX(-${tamañoSlide}px)`;


            setTimeout(() => {
                slideshow.current.style.transition = `${velocidad}ms ease-out all`;
                slideshow.current.style.transform = `translateX(0)`;
            }, 30);
        }
    }


    useEffect(() => {

        if (autoplay) {

            //Ejecuta una funcion
            intervaloSlideShow.current = setInterval(() => {
                siguiente();
            }, intervalo);

            //Eliminamos los intervalos
            slideshow.current.addEventListener('mouseenter', () => {
                clearInterval(intervaloSlideShow.current);
            });

            //Volvemos a poner el intervalo cuando saquen el cursor delslideshow
            slideshow.current.addEventListener('mouseleave', () => {
                intervaloSlideShow.current = setInterval(() => {
                    siguiente();
                }, intervalo);
            });

        }




    }, [autoplay, intervalo, siguiente]);


    return (
        <ContenedorPrincipal> {/* Contenedor principal */}

            <ContenedorSlideShow ref={slideshow}>


                {children}


            </ContenedorSlideShow>


            {controles && <Controles>

                <Boton onClick={anterior}>
                    <FlechaIzquierda />
                </Boton>

                <Boton derecho onClick={siguiente}>
                    <FlechaDerecha />
                </Boton>

            </Controles>}

        </ContenedorPrincipal>
    );
}


const ContenedorPrincipal = styled.div`
    position: relative;
`;


const ContenedorSlideShow = styled.div`
    display: flex; /* Colocación de imagenes */
    flex-wrap: nowrap;
`;


const Slide = styled.div`
    min-width: 100%; /* 100 % del ancho disponible del contenedor */
    overflow: hidden;
    transition: .3s ease all;
    z-index: 9; /* El slide queda arriba de otros elementos */
    /* max-height: 500px; */
    position: relative;

    img{
        width: 100%;
        vertical-align: top;

    }
`;


const TextoSlide = styled.div`
    background: ${props => props.colorFondo ? props.colorFondo : 'rgba(0, 0, 0, .3)'};
    color: ${props => props.colorTexto ? props.colorTexto : '#FFF'};
    width: 100%;
    padding: 10px 68px;
    text-align: center;
    position: absolute;
    bottom: 0;

    @media screen and (max-width: 700px) {
        position: relative;
        background: #000;
    }
`;


const Controles = styled.div`
    position: absolute;
    top: 0;
    z-index: 20;
    width: 100%; /* ancho del 100 % del espacio disponible */
    height: 100%;
    pointer-events: none;
`;


const Boton = styled.button`
    pointer-events: all;
    background: none;
    border: none;
    cursor: pointer;
    outline: none;
    width: 50px;
    height: 100%;
    text-align: center;
    position: absolute;
    transition: .3s ease all;
    /* &:hover {
        background: rgba(0, 0, 0, .2);
        path {
            fill: #FFF;
        }
    }
    */
    path {
        filter: ${props => props.derecho ? 'drop-shadow(-2px 0px 0px #FFF)' : 'drop-shadow(2px 0px 0px #FFF)'};
    }

    ${props => props.derecho ? 'right: 0' : 'left: 0'}
`;

export { Slideshow, Slide, TextoSlide };