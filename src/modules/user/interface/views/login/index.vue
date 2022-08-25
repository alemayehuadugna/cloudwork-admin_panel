<template>
	<div class="login-container">
		<el-form
			ref="loginForm"
			:model="loginForm"
			:rules="loginRules"
			class="login-form"
			autocomplete="on"
			label-position="left"
		>
			<div class="title-container">
				<h3 class="title">Login</h3>
			</div>

			<el-form-item prop="username">
				<span class="svg-container">
					<svg-icon name="user" />
				</span>
				<el-input
					ref="username"
					v-model="loginForm.email"
					placeholder="Email"
					name="username"
					type="text"
					tabindex="1"
					autocomplete="on"
				/>
			</el-form-item>

			<el-tooltip
				v-model="capsTooltip"
				content="Caps lock is On"
				placement="right"
				manual
			>
				<el-form-item prop="password">
					<span class="svg-container">
						<svg-icon name="password" />
					</span>
					<el-input
						:key="passwordType"
						ref="password"
						v-model="loginForm.password"
						:type="passwordType"
						placeholder="Password"
						name="password"
						tabindex="2"
						autocomplete="on"
						@keyup.native="checkCapslock"
						@blur="capsTooltip = false"
						@keyup.enter.native="handleLogin"
					/>
					<span class="show-pwd" @click="showPwd">
						<svg-icon
							:name="
								passwordType === 'password'
									? 'eye-off'
									: 'eye-on'
							"
						/>
					</span>
				</el-form-item>
			</el-tooltip>

			<el-button
				:loading="loading"
				type="primary"
				style="width: 100%; margin-bottom: 30px"
				@click.native.prevent="handleLogin"
			>
				Login
			</el-button>
		</el-form>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Form as ElForm, Input } from "element-ui";
import { Route } from "vue-router";
import { isValidEmail } from "@/_core/utils/validate";
import { Dictionary } from "vue-router/types/router";
import { UserModule } from "@/modules/user/interface/store";

@Component({ name: "Login" })
export default class extends Vue {
	private validateUsername = (
		rule: any,
		value: string,
		callback: Function
	) => {
		if (!isValidEmail(value)) {
			callback(new Error("Please enter the correct email address"));
		} else {
			callback();
		}
	};

	private validatePassword = (
		rule: any,
		value: string,
		callback: Function
	) => {
		if (value.length < 6) {
			callback(new Error("The password can not be less than 8 digits"));
		} else {
			callback();
		}
	};

	public loginForm = {
		email: "shakazulu@gmail.com",
		password: "test@test",
	};

	public loginRules = {
		email: [{ validator: this.validateUsername, trigger: "blur" }],
		password: [{ validator: this.validatePassword, trigger: "blur" }],
	};

	public passwordType = "password";
	public loading = false;
	public showDialog = false;
	public capsTooltip = false;
	public redirect?: string;
	public otherQuery: Dictionary<string> = {};

	@Watch("$route", { immediate: true })
	public onRouteChange(route: Route) {
		const query = route.query as Dictionary<string>;
		if (query) {
			this.redirect = query.redirect;
			this.otherQuery = this.getOtherQuery(query);
		}
	}

	mounted() {
		if (this.loginForm.email === "") {
			(this.$refs.username as Input).focus();
		} else if (this.loginForm.password === "") {
			(this.$refs.password as Input).focus();
		}
	}

	public checkCapslock(e: KeyboardEvent) {
		const { key } = e;
		this.capsTooltip =
			key !== null && key.length === 1 && key >= "A" && key <= "Z";
	}

	public showPwd() {
		if (this.passwordType === "password") {
			this.passwordType = "";
		} else {
			this.passwordType = "password";
		}
		this.$nextTick(() => {
			(this.$refs.password as Input).focus();
		});
	}

	public handleLogin() {
		(this.$refs.loginForm as ElForm).validate(async (valid: boolean) => {
			if (valid) {
				this.loading = true;
				await UserModule.Login(this.loginForm);
				this.$router
					.push({
						path: this.redirect || "/",
						query: this.otherQuery,
					})
					.catch((err) => {
						console.warn(err);
					});
				// Just to simulate the time of the request
				setTimeout(() => {
					this.loading = false;
				}, 0.5 * 1000);
			} else {
				return false;
			}
		});
	}

	private getOtherQuery(query: Dictionary<string>) {
		return Object.keys(query).reduce((acc, cur) => {
			if (cur !== "redirect") {
				acc[cur] = query[cur];
			}
			return acc;
		}, {} as Dictionary<string>);
	}
}
</script>

<style lang="scss">
@supports (-webkit-mask: none) and (not (cater-color: $loginCursorColor)) {
	.login-container .el-input {
		input {
			color: $loginCursorColor;
		}
		input::first-line {
			color: $lightGray;
		}
	}
}

.login-container {
	.el-input {
		display: inline-block;
		height: 47px;
		width: 85%;

		input {
			height: 47px;
			background: transparent;
			border: 0px;
			border-radius: 0px;
			padding: 12px 5px 12px 15px;
			color: $lightGray;
			caret-color: $loginCursorColor;
			-webkit-appearance: none;

			&:-webkit-autofill {
				box-shadow: 0 0 0px 1000px $loginBg inset !important;
				-webkit-text-fill-color: #fff !important;
			}
		}
	}

	.el-form-item {
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(0, 0, 0, 0.1);
		border-radius: 5px;
		color: #454545;
	}
}
</style>

<style lang="scss" scoped>
.login-container {
	height: 100%;
	width: 100%;
	overflow: hidden;
	background-color: $loginBg;

	.login-form {
		position: relative;
		width: 520px;
		max-width: 100%;
		padding: 160px 35px 0;
		margin: 0 auto;
		overflow: hidden;
	}

	.tips {
		font-size: 14px;
		color: #fff;
		margin-bottom: 10px;

		span {
			&:first-of-type {
				margin-right: 16px;
			}
		}
	}

	.svg-container {
		padding: 6px 5px 6px 15px;
		color: $darkGray;
		vertical-align: middle;
		width: 30px;
		display: inline-block;
	}

	.title-container {
		position: relative;

		.title {
			font-size: 26px;
			color: $lightGray;
			margin: 0px auto 40px auto;
			text-align: center;
			font-weight: bold;
		}

		.set-language {
			color: #fff;
			position: absolute;
			top: 3px;
			font-size: 18px;
			right: 0px;
			cursor: pointer;
		}
	}

	.show-pwd {
		position: absolute;
		right: 10px;
		top: 7px;
		font-size: 16px;
		color: $darkGray;
		cursor: pointer;
		user-select: none;
	}

	.thirdparty-button {
		position: absolute;
		right: 0;
		bottom: 6px;
	}

	@media only screen and (max-width: 470px) {
		.thirdparty-button {
			display: none;
		}
	}
}
</style>
