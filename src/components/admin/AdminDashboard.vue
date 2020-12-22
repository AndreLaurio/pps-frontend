<template>
  <nav class="pop">
    <v-navigation-drawer v-model="drawer" app color="#292935">
      <v-list dense>
        <v-list>
          <div class="text-center">
            <v-avatar color="#760D11" size="50">
              <span class="white--text headline">A</span>
            </v-avatar>
          </div>
          <v-list-item-content color="#760D11">
            <div>
              <h4 class="white--text text-center mt-3">
                {{ userData.first_name }} {{ userData.last_name }}
              </h4>
            </div>
          </v-list-item-content>
        </v-list>
        <!-- <v-list-item link>
                    <v-list-item-action>
                        <v-icon color="#760D11">mdi-home</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        Home
                    </v-list-item-content>
                </v-list-item>
                 <v-list-item link v-on:click="adminExaminees">
                    <v-list-item-action>
                        <v-icon color="#760D11">mdi-account-supervisor</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        Examinees
                    </v-list-item-content>
                </v-list-item> -->
        <v-list-item link v-on:click="adminExamination">
          <v-list-item-action>
            <v-icon color="white">mdi-clipboard-text-multiple</v-icon>
          </v-list-item-action>
          <v-list-item-content class="white--text">
            Examinations
          </v-list-item-content>
        </v-list-item>
        <v-list-item link v-on:click="accountApproval">
          <v-list-item-action>
            <v-icon color="white">mdi-account-supervisor-circle-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content class="white--text">
            Account Approval
          </v-list-item-content>
        </v-list-item>
        <v-list-item link v-on:click="createUser">
          <v-list-item-action>
            <v-icon color="white">mdi-account-plus</v-icon>
          </v-list-item-action>
          <v-list-item-content class="white--text">
            Create User
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
      </v-list>
      <template v-slot:append>
        <div class="pa-2 text-center mb-5">
          <img src="../../assets/vixam_logo.png" />
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar app color="indigo" dark>
      <v-app-bar-nav-icon
        class="mr-3"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
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
      },
      drawer: true,
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
      });
    },
    createUser() {
      this.$router.push({ name: "AdminCreateUser" });
    },
    accountApproval() {
      this.$router.push({ name: "AdminAccountApproval" });
    },
    adminExamination() {
      this.$router.push({ name: "AdminExamination" });
    },
    logout() {
      axios.post("/logout").then((response) => {
        this.$router.push({ name: "Home" });
      });
    },
  },
};
</script>
