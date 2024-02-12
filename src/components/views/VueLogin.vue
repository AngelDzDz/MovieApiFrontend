<template>
    <div class="container d-flex align-items-center justify-content-center vh-100">
        <div class="card p-5">
            <form @submit.prevent="login">
                <div class="d-flex justify-content-center">
                    <img :src="require('/public/images/filmLogin.svg')" alt="Movie App" width="75" height="65">
                </div>
                <h3 class="text-center my-3">Inicia sesión</h3>
                <div class="form-floating my-3">
                    <input type="text" class="form-control" id="username" name="username" v-model="username"  placeholder="" required>
                    <label for="username">Nombre de usuario</label>
                </div>

                <div class="form-floating my-3">
                    <input type="password" class="form-control" id="password" name="password" v-model="password" placeholder="" required>
                    <label for="password">Contraseña</label>
                </div>

                <div class="d-flex justify-content-center my-3">
                    <button class ="btn btn-info">Iniciar sesión</button>
                    
                </div>

                <div class="d-flex justify-content-center my-3">
                    <a href="/register" @click="goToRegister()" class="link-info text-decoration-none ">¿No tienes una cuenta? Regístrate aquí</a>
                </div>
                <div>
                    <p :class="pClass" v-if=errorMessage>{{ errorMessage }}</p>
                </div>
            </form>
        </div>
    </div>

</template>

<script>
    import router from '@/router';
    import {ref,computed} from 'vue';
    export default {
        name:"VueLogin",

        setup() {
            const username = ref('');
            const password = ref('');
            const errorMessage = ref('');

            const pClass = computed(() => {
                return errorMessage.value ? 'alert alert-danger' : 'd-none';
            });

            const login = async () => {
               errorMessage.value="";
                let dataLogin =  {
                    username: username.value,
                    password: password.value
                };

                try {
                    const response = await fetch('http://127.0.0.1:8080/api/v1/login', 
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(
                            dataLogin
                        ),
                    });
                    
                    if (!response.ok) {
                        const failedResponse = await response.json();
                        errorMessage.value=failedResponse.message;
                        throw new Error('Login failed');
                    }
                    
                    
                    const responseData = await response.json();

                    const token = responseData.body.token;
                    const user = responseData.body.user.username;
                    localStorage.setItem('user',user);
                    localStorage.setItem('token',token);
                    localStorage.setItem('authenticated','true');

                    router.push('/my-movies');

                
                   
                    
                } catch (error) {
                    console.error('Error during login:', error);
                }
            };

            const goToRegister = () => {
                router.push("/register")
            }

            return {
                username,
                password,
                login,
                errorMessage,
                pClass,
                goToRegister    
            };
        }

    }
</script>

<style>

</style>