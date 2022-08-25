import "reflect-metadata";
import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";

import { injectUser } from "@/modules/user/injection";

import { injectFeedback } from "@/modules/feedback/injections";

import { injectEmployee } from "@/modules/employee/injection";
import { injectFreelancer } from "@/modules/freelancer/injection";
import { injectClient } from "@/modules/client/injection";
import { injectJob } from "@/modules/job/injection";
import {injectCategory } from "@/modules/category/injection";
import { injectTransaction } from "@/modules/transaction/injection";
import { injectDashboard } from '../../modules/dashboard/injection';

const container = new Container();

// dependency injection of user module
injectUser(container);

injectFeedback(container);

injectEmployee(container);

injectFreelancer(container);

injectClient(container);

injectJob(container);

injectCategory(container);

injectTransaction(container);

injectDashboard(container);

const { lazyInject } = getDecorators(container);
export { lazyInject, container };
