// src/mocks/handlers.js
import { rest } from "msw";

export const handlers = [
  rest.get("/api", (req, res, ctx) => {
    const profile = {
      authority: "TR",
      authorities: ["UZ"],
      roles: ["ROLE_ADMIN"]
    };
    return res(ctx.json(profile));
  }),
  // Handles a POST /login request
  rest.post("/api/authorities", (req, res, ctx) => {
    return res(ctx.status(400), ctx.json({ error_message: "Custom error" }));
    //window.localStorage.setItem("authorityCreated", "true");
    //return res(ctx.json({ code: "RU" }));
  }),
  // Handles a GET /user request
  rest.get("/api/authorities/:code", (req, res, ctx) => {
    const authority = {
      code: "UZ",
      api_uri: "https://epermit.gov.uz",
      quotas: [
        {
          permit_issuer: "TR",
          permit_issued_for: "UZ",
          permit_year: 2022,
          permit_type: "BILITERAL",
          start_number: 1,
          end_number: 1000,
          used_count: 55
        }
      ]
    };
    return res(ctx.json(authority));
  }),
  rest.get("/api/permits/:id", (req, res, ctx) => {
    return res(
      ctx.json({
        issuer: "UZ",
        issued_for: "TR",
        permit_id: req.params.id,
        permit_type: "BILITERAL",
        permit_year: 2022,
        issued_at: "03/03/2022",
        expire_at: "31/01/2023",
        plate_number: "06TEST1234",
        company_id: "123456",
        company_name: "Test com"
      })
    );
  })
];
