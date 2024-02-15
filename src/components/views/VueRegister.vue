<template>
    <div class="container d-flex align-items-center justify-content-center vh-100">
        <div class="card p-5">
            <form @submit.prevent="register()">
                <div class="d-flex justify-content-center">
                    <img :src="require('/public/images/film.svg')" alt="Registro" width="75" height="65">
                </div>
                <h3 class="text-center my-3">Regístrate</h3>
                <div class="form-floating my-3">
                    <input type="text" class="form-control" id="username" name="username" v-model="username"  placeholder="" required>
                    <label for="username">Nombre de usuario</label>
                </div>

                <div class="form-floating my-3">
                    <input type="password" class="form-control" id="password" name="password" v-model="password" placeholder="" required>
                    <label for="password">Contraseña</label>
                </div>

                <div class="form-floating my-3">
                    <input type="password" class="form-control" id="repeatedPassword" name="repeatedPassword" v-model="repeatedPassword" placeholder="" required>
                    <label for="password">Confirma la contraseña</label>
                </div>

                <div class="d-flex justify-content-center my-3">
                    <button class ="btn btn-info">Registrarse</button>
                </div>

                <div class="d-flex justify-content-center my-3">
                    <a href="/login" @click="goToLogin()" class="link-info text-decoration-none ">¿Ya tienes una cuenta? Inicia sesión</a>
                </div>

                <div>
                    <p :class="errorClass" v-if=errorMessage>{{ errorMessage }}</p>
                </div>
                <div>
                    <p :class="successClass" v-if=successMessage>{{ successMessage }}</p>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
import router from '@/router';
import { ref,computed } from 'vue';
export default {
    name:'VueRegister',

    setup() {
        const username = ref('');
        const password = ref('');
        const repeatedPassword = ref('');
        const errorMessage = ref('');
        const successMessage = ref('');

        const errorClass = computed(() => {
                return errorMessage.value ? 'alert alert-danger text-center' : 'd-none';
        });

        const successClass = computed(() => {
            return successMessage.value ? 'alert alert-success text-center' : 'd-none';
        });

        const goToLogin = () => {
            router.push('/login');
        }

        const register = async() => {

            errorMessage.value="";
            successMessage.value="";
            if(password.value!= repeatedPassword.value) {
                errorMessage.value="Las contraseñas deben de coincidir!";
                return;
            }

            let dataRegister = {
                username:username.value,
                password: password.value
            }

            try {
                    const response = await fetch('http://127.0.0.1:8080/api/v1/signup', 
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(
                            dataRegister
                        ),
                    });
                    
                    if (!response.ok) {
                        const failedResponse = await response.json();
                        errorMessage.value=failedResponse.message;
                        throw new Error('Signup failed');
                    }
                    
                    
                    //const responseData = await response.json();
                    successMessage.value="Registro correcto, por favor inicie sesión";

                    
                } catch (error) {
                    console.error('Error during signup:', error);
                }
        }
        return {
            username,
            password,
            repeatedPassword,
            goToLogin,
            register,
            errorClass,
            errorMessage,
            successMessage,
            successClass
        }
    }
    
}
</script>
<style lang="">
    
</style>