<template>
    <el-form>
        <el-form-item label="Current Password">
            <el-input v-model.trim="oldPassword" />
        </el-form-item>
        <el-form-item label="New Password">
            <el-input v-model.trim="newPassword" />
        </el-form-item>
        <el-form-item label="Confirm new Password">
            <el-input v-model.trim="confirmPassword" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submit">
                Update Password
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import { UserStore } from "../../../store";
import { IProfile } from "../index.vue";

@Component({
    name: "Password",
})
export default class extends Vue {
    @Prop({ required: true }) private user!: IProfile;

    get profileStore(): UserStore {
        return getModule(UserStore, this.$store);
    }
    id: string = "";
	private oldPassword = '';
	private newPassword = '';
	private	confirmPassword = '';

    private submit() {
        const oldPassword = this.oldPassword;
        const newPassword = this.newPassword;
        const confPassword = this.confirmPassword;
        var id = this.id;
        // console.log(newPassword.length);
        // console.log(this.user.oldPassword);
        if (newPassword.length > 6) {
            if (confPassword == newPassword) {

               this.profileStore.UpdatePassword({
                    id,
                    oldPassword,
                    newPassword,
                    })
                // this.$message({
                //     message: "Updated",
                //     type: "success",
                //     duration: 5 * 1000,
                // });
            
            } else if (confPassword != newPassword) {
                this.$message({
                    message: "Password and Confirm password does not match.",
                    type: "error",
                    duration: 5 * 1000,
                });
            }
        } else {
            this.$message({
                message: "The password can not be less than 6 digits",
                type: "error",
                duration: 5 * 1000,
            });
        }
    }
}
</script>
