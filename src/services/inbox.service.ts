import { MAIL_DROP_API_HOST, USER_EMAIL } from "../consts";


type TMailListItem = {
    id: string,
    headerfrom: string,
    subject: string,
    date: string
}

type TMailListResponse = {
    data: {
        inbox: TMailListItem[]
    }
}

type TMessageResponse = {
    data: {
        message: TMailListItem & { html: string }
    }
}

type TDeleteResponse = {
    data: {
        delete: boolean
    }
}
// https://maildrop.cc
// https://docs.maildrop.cc/graphql-types/message
class InboxService {
    readonly userName = USER_EMAIL.split('@')[0]
    readonly headers = new Headers()

    constructor() {
        this.headers.append("content-type", "application/json");
    }

    async getInbox(): Promise<TMailListResponse | undefined> {
        const response = await fetch(MAIL_DROP_API_HOST, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                query: `query Example { inbox(mailbox:"${this.userName}") { id headerfrom subject date } }`,
                variables: {}
            }),
            redirect: "follow"
        })
        return response.json()
    }

    async getDetailEmail(id: string): Promise<TMessageResponse | undefined> {
        const response = await fetch(MAIL_DROP_API_HOST, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                query: `query Example { message(mailbox:"${this.userName}", id:"${id}") { id headerfrom subject date html } }`,
                variables: {}
            }),
            redirect: "follow"
        })
        return response.json() as Promise<TMessageResponse>
    }

    async delete(id: string) {
        const response = await fetch(MAIL_DROP_API_HOST, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                query: `mutation Example { delete(mailbox:"${this.userName}", id:"${id}") }`,
                variables: {}
            }),
            redirect: "follow"
        })
        return response.json() as Promise<TDeleteResponse>
    }
}

export const inboxService = new InboxService()