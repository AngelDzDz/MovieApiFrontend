<template>
    <button class="btn btn-primary me-2" data-bs-toggle="modal" :data-bs-target="generateModalTarget()">
        <font-awesome-icon icon="pen" />
    </button>

    <div class="modal fade" :id="generateId()" tabindex="-1" data-bs-backdrop="static"
            aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Editar película</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="editMovie">
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="titleEdit" class="col-form-label">Título:</label>
                            <input type="text" class="form-control" id="titleEdit" placeholder="Título" required
                                v-model="movie.title">
                        </div>
                        <div class="mb-3">
                            <label for="genresEdit" class="col-form-label">Género:</label>
                            <select class="form-select" name="genresEdit" id="genresEdit" v-model="genre">
                                <option v-for="genre in genreOptions" :key="genre.id" :value="genre.id">
                                    {{ genre.name }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="directorEdit" class="col-form-label">Director:</label>
                            <input type="text" class="form-control" id="directorEdit" placeholder="Director"
                                v-model="movie.director" required>
                        </div>
                        <div class="mb-3">
                            <label for="descriptionEdit" class="col-form-label">Descripción:</label>
                            <textarea class="form-control" id="descriptionEdit" v-model="movie.description"
                                required></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="durationEdit" class="col-form-label">Duración:</label>
                            <input type="text" class="form-control" id="durationEdit" placeholder="Duración"
                                v-model="movie.duration" required>
                        </div>
                        <div class="mb-3">
                            <label class="col-form-label">Estrellas:</label>
                            <FilledRankingStars :starValue="movie.stars" :movieId="movie.id" />

                        </div>
                        <div class="mb-3">
                            <label for="yearOfReleaseEdit" class="col-form-label">Año de estreno:</label>
                            <input type="text" class="form-control" id="yearOfReleaseEdit" placeholder="Año de estreno"
                                v-model="movie.yearOfRelease" required>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-success">Editar</button>
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </form>
            </div>
        </div>

    </div>
</template>


<script>
import { ref, onMounted } from 'vue';
import router from '@/router';
import FilledRankingStars from './FilledRankingStars.vue';
import { starNumber } from '@/store';
import Swal from 'sweetalert2';
export default {
    name: 'EditWatchedMovies',
    props: {
        movieObject: {
            type: Object,
            required: true,
        },
        fetchWatchedMovies: {
            type: Function,
            required: true,
        }
    },

    setup(props) {
        const movie = ref({ ...props.movieObject }); //copia la referencia en nuevo objeto
        const genreOptions = ref([]);
        const genre = ref(movie.value.genre.id);
        onMounted(async () => {
            try {
                const response = await fetch('http://127.0.0.1:8080/api/v1/genres', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.status === 401) {
                    router.push('/login');
                }
                if (!response.ok) {
                    const failedResponse = await response.json();
                    throw new Error('Failed response', failedResponse);
                }
                const responseData = await response.json();

                genreOptions.value = responseData.body;
            }
            catch (error) {
                console.error('Error during consume:', error);
                Swal.fire({
                        icon:"error",
                        title:error.message
                });
            }
        });

        const validateDataMovie = (data) => {
            data.duration = parseInt(data.duration, 10);
            if (isNaN(data.duration)) {
                Swal.fire({
                    icon: "error",
                    title: "La duración debe de ser un número!"
                });
                return false;
            }

            if (data.stars === 0) {
                Swal.fire({
                    icon: "error",
                    title: "Las estrellas no pueden ser cero!"
                });
                return false;
            }

            data.yearOfRelease = parseInt(data.yearOfRelease, 10);
            if (isNaN(data.yearOfRelease)) {
                Swal.fire({
                    icon: "error",
                    title: "El año debe de ser un número!"
                });
                return false;
            }

            return true;
        }
        //edit with starNumber.value
        const editMovie = async () => {

            let updatedData = {
                id: movie.value.id,
                title: movie.value.title,
                genre: {
                    id: genre.value
                },
                director: movie.value.director,
                description: movie.value.description,
                duration: movie.value.duration,
                yearOfRelease: movie.value.yearOfRelease,
                isWatched: true
            }

            if (starNumber.value == 0) {
                updatedData.stars = movie.value.stars;
            } else {
                updatedData.stars = starNumber.value;
            }

            if (validateDataMovie(updatedData)) {
                try {
                    const response = await fetch('http://127.0.0.1:8080/api/v1/movies', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify(updatedData)
                    });

                    if(response.status === 400) {
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
                    //const responseData = await response.json();
                    location.reload()
                    router.push('/my-movies');
                    
                }
                catch (error) {
                    console.error('Error during consume:', error);
                    Swal.fire({
                        icon:"error",
                        title:error.message
                    });
                }

            }
        };

        const generateModalTarget = () => {
            return `#M${movie.value.id}`;
        };
        const generateId = () => {
            return `M${movie.value.id}`;
        };

        return {
            movie,
            generateModalTarget,
            generateId,
            editMovie,
            genreOptions,
            genre

        };
    },
    components: { FilledRankingStars }
}

</script>