<template>
    <button class="btn me-2 watched" data-bs-toggle="modal" :data-bs-target="generateModalTarget()">
        <font-awesome-icon icon="eye" />
    </button>

    <div class="modal fade" :id="generateId()"  tabindex="-1" data-bs-backdrop="static"
            aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Cambiar a película ya vista</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="text-center">
                        <p>Califique la película.</p>
                        <FilledRankingStars :starValue="0" :movieId="movie.id" />
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" @click="changeToWatched()">Ya ví la pelicula</button>
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { starNumber } from '@/store';
import { ref } from 'vue';
import FilledRankingStars from './FilledRankingStars.vue';
import router from '@/router';
import Swal from 'sweetalert2';


export default {
    name: 'ChangeToWatched',
    components: { FilledRankingStars },
    props: {
        movieObject: {
            type: Object,
            required: true,
        },
        fetchNonWatchedMovies: {
            type:Function,
            required:true
        }                                
    },

    setup(props) {
        const movie = ref(props.movieObject)
        
        const changeToWatched = async () => {

            let movieToChange = {
                id: movie.value.id,
                title: movie.value.title,
                genre: {
                    id: movie.value.genre.id
                },
                director: movie.value.director,
                description: movie.value.description,
                duration: movie.value.duration,
                stars: starNumber.value,
                yearOfRelease: movie.value.yearOfRelease,
                isWatched: true
            }

            try {
                const response = await fetch('http://127.0.0.1:8080/api/v1/movies', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(movieToChange)
                });

                if (response.status === 400) {
                    const failedResponse = await response.json();
                    throw new Error(failedResponse.message);
                }

                if (response.status === 401) {
                    router.push('/login');
                }
                if (!response.ok) {
                    const failedResponse = await response.json();
                    throw new Error('Failed response', failedResponse);
                }
                router.push('/to-watch-movies');
                const backdropElement = document.querySelector('.modal-backdrop');
                backdropElement.parentNode.removeChild(backdropElement);
                await props.fetchNonWatchedMovies();
                
            }
            catch (error) {
                Swal.fire({
                    icon: "error",
                    title: error.message
                });
            }
        }

        const generateModalTarget = () => {
            return `#MChange${movie.value.id}`;
        };
        const generateId = () => {
            return `MChange${movie.value.id}`;
        };

        return {
            movie,
            changeToWatched,
            generateModalTarget,
            generateId
        }
    },

}
</script>

<style>
.watched.btn {
    background-color: orange;
    color: white;
}

.watched.btn:hover {
    background-color: orange;
    color: white;
}

.watched.btn:active {

    background-color: orange;
    color: white;
}
</style>