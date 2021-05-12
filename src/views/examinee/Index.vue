<template>
    <div>
        <ExamineeHome/>
            <v-main>
                <ExamineeDashboard />
            </v-main>
    </div>
</template>

<script>
import ExamineeHome from '@/components/examinee/Home'
import ExamineeDashboard from '@/components/examinee/Dashboard'

export default {
    data(){
        return{

        }
    },
    components:{
        ExamineeHome, ExamineeDashboard
    }
}
</script>