const API_LOGIN = "https://learn.zone01oujda.ma/api/auth/signin";
const API_Global =
  "https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql";

const query = `{
    user {
    id
    login
    firstName
    lastName
    email
    totalUp
    totalDown
    auditRatio
    campus
    modules : transactions (where: { 
    event: { object: { type: { _eq: "module" } } }, 
    type: { _eq: "xp" } 
    }
    order_by: { createdAt: desc}
    limit: 6
    ) {
    object {
    name
    }
    type
    createdAt
    amount
    }
    skills:transactions(distinct_on: type 
    where: { type: { _like: "skill_%" } }
    order_by: [{ type: asc }, { amount: desc }]){
    type
    amount
    }
    levels: transactions(
    where: {eventId: {_eq: 41}, type: {_eq: "level"}}
    order_by: {amount: desc}
    limit: 1
    ) {
    amount
    }
    
    }
    transaction (where: { 
    type: { _eq: "xp" },
    eventId : { _eq: 41 }}
    order_by: {createdAt: desc}
    ){
    amount
    }
    }`;

export { API_LOGIN, API_Global, query };
