<template>
  <nav class="pop">
    <v-navigation-drawer v-model="drawer" app color="#292935">
      <v-list dense>
        <v-list>
          <div class="text-center">
            <v-avatar color="indigo" size="50" v-if="isWithPP == false">
              <v-icon dark>mdi-account-circle</v-icon>
            </v-avatar>
          </div>
          <v-list-item-content>
            <v-avatar v-if="isWithPP == true">
              <img
                :src="
                  require(`../../assets/storage/images/profiles/${userData.profile_pic}`)
                "
                width="100px"
                height="100px"
              />
            </v-avatar>
            <div>
              <h4 class="white--text text-center mt-3">
                {{ userData.first_name }} {{ userData.last_name }}
              </h4>
            </div>
          </v-list-item-content>
        </v-list>
        <v-list-item-group active-class="white--text font-weight-bold">
          <v-list-item link v-on:click="userProfile">
            <v-list-item-action>
              <v-icon color="white">mdi-face</v-icon>
            </v-list-item-action>
            <v-list-item-content class="white--text">
              Profile
            </v-list-item-content>
          </v-list-item>
          <v-list-item link v-on:click="userExamination">
            <v-list-item-action>
              <v-icon color="white">mdi-clipboard-text-multiple</v-icon>
            </v-list-item-action>
            <v-list-item-content class="white--text">
              Examination
            </v-list-item-content>
          </v-list-item>
          <v-list-item link v-on:click="logout">
            <v-list-item-action>
              <v-icon color="white">mdi-logout</v-icon>
            </v-list-item-action>
            <v-list-item-content class="white--text">
              Logout
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <template v-slot:append>
        <div class="pa-2 text-center mb-5">
          <img src="../../assets/vixam_logo.png" />
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar app color="indigo" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Vixam</v-toolbar-title>
    </v-app-bar>
  </nav>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");
.pop {
  font-family: "Poppins", sans-serif;
}
</style>

<script>
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8000";

export default {
  data() {
    return {
      userData: {
        first_name: "",
        last_name: "",
        profile_pic: "",
      },
      drawer: true,
      isWithPP: false,
    };
  },
  mounted() {
    this.getUserData();
  },
  methods: {
    getUserData() {
      axios.get("/api/user").then((response) => {
        (this.userData.first_name = response.data.first_name),
          (this.userData.last_name = response.data.last_name);
        if (response.data.photo_src != null) {
          this.userData.profile_pic = response.data.photo_src;
          this.isWithPP = true;
        }
      });
    },
    logout() {
      axios.post("/logout").then((response) => {
        this.$router.push({ name: "Home" });
      });
    },
    userExamination() {
      this.$router.push({ name: "UserExamination" });
    },
    userProfile() {
      this.$router.push({ name: "UserProfile" });
    },
  },
};
</script>
