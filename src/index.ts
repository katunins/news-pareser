import { auth } from "./stages/auth";

async function app() {
    await auth()
}

app()