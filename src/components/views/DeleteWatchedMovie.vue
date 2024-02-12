<template>
    <button @click="showAlert()" class="btn btn-danger">
        <font-awesome-icon icon="trash" />
    </button>
</template>

<script>
import Swal from 'sweetalert2';
import { ref } from 'vue';
export default {
    name:"DeleteWatchedMovie",
    props: {
        idDeletedMovie : {
            type: Number,
            required: true,
        },
        fetchWatchedMovies: {
            type: Function,
            required: true,
        },
        
    },

    setup(props) {
        const idOfDeletedMovie = ref(props.idDeletedMovie);
        const showAlert = () => {
            Swal.fire({
                title: '¿Está seguro de eliminar la película?',
                text: 'No podrá revertir esta acción!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí",
                cancelButtonText: "Cancelar",

                preConfirm: async () => {
                    try {
                        const response = await fetch(`http://127.0.0.1:8080/api/v1/movies/${idOfDeletedMovie.value}`,{
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            }    
                        });
                        if (!response.ok) {
                            return Swal.showValidationMessage(`
                            ${JSON.stringify(await response.json())}`);
                        }
                        const responseData = await response.json();
                       
                        await props.fetchWatchedMovies();
                        return responseData;
                    } catch (error) {
                        Swal.showValidationMessage(`Request failed: ${error}`);
                    }
                }
            });
        }

        return {
            showAlert,
            idOfDeletedMovie
        }
    }
}
</script>