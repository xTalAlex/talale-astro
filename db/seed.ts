import { db, User } from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(User).values([
    {
      netlify_id: "c8be5cc3-688b-4e32-b9e6-ccaf62c3dfa8",
      name: "Talale",
      email: "talale932@gmail.com",
      streak_record: 5,
      cur_streak: 0,
      created_at: new Date(Date.parse("2023-05-18 14:14:22")),
      updated_at: new Date(Date.parse("2024-03-13 22:16:53")),
    },
    {
      netlify_id: "6f9ba410-db53-4b7a-a08d-a8f241eb37b5",
      name: "Marti",
      email: "martinacasciana15@hotmail.com",
      streak_record: 1,
      cur_streak: 0,
      created_at: new Date(Date.parse("2023-05-18 15:59:33")),
      updated_at: new Date(Date.parse("2023-11-02 16:34:21")),
    },
    {
      netlify_id: "ea1fb9d0-421c-45e9-8079-a428e1cff989",
      name: "Spezzatino Pazz",
      email: "teo.ripley@gmail.com",
      streak_record: 1,
      cur_streak: 0,
      created_at: new Date(Date.parse("2023-05-29 18:34:10")),
      updated_at: new Date(Date.parse("2023-05-29 18:38:47")),
    },
    {
      netlify_id: "2b419adb-aa45-476d-9b71-9f3ad6ceb410",
      name: "Alias Etchu",
      email: "nikyssimo22@gmail.com",
      streak_record: 0,
      cur_streak: 0,
      created_at: new Date(Date.parse("2023-07-16 21:50:29")),
      updated_at: new Date(Date.parse("2023-07-16 21:50:29")),
    },
    {
      netlify_id: "72e85d4f-7307-4ff0-8067-cdd6b59cae30",
      name: "Adriano Talamona",
      email: "talamonaadriano@gmail.com",
      streak_record: 1,
      cur_streak: 0,
      created_at: new Date(Date.parse("2024-02-20 20:04:14")),
      updated_at: new Date(Date.parse("2024-02-20 20:12:27")),
    },
  ]);
}
