<template>
    <div class="pop mt-12 ml-12">
        <h2 class="mb-12">Examination</h2>
        <v-layout>
            <v-flex>
                <v-card max-width="300">
                    <v-img src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg" width="300px"></v-img>
                    <v-card-title>
                        Sample Title
                    </v-card-title>
                    <v-card-text>
                        Content
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="primary">Take</v-btn>
                        <v-btn class="error"> Delete</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
            <v-flex>
                <v-card max-width="300">
                    <v-img src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg" width="300px"></v-img>
                    <v-card-title>
                        Sample Title
                    </v-card-title>
                    <v-card-text>
                        Content
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="primary mr-3">Take</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
            <v-flex>
                <v-card max-width="300">
                    <v-img src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg" width="300px"></v-img>
                    <v-card-title>
                        Sample Title
                    </v-card-title>
                    <v-card-text>
                        Content
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="primary mr-3">Take</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
        
            <v-main>
                <UserDashboard/>
            </v-main>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
.pop{
    font-family: 'Poppins', sans-serif;
}
</style>

<script>
import UserDashboard from '@/components/user/UserDashboard'

export default {
    data(){
        return{

        }
    },
    components:{
        UserDashboard
    }
}
</script>