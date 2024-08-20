import { ScheduleSession } from "./src/components/Conf/Schedule/ScheduleList"
import { SchedSpeaker } from "./src/components/Conf/Speakers/Speaker"
import { GatsbyNode } from "gatsby"
import { createOpenGraphImage } from "gatsby-plugin-dynamic-open-graph-images"
import * as path from "path"
import { glob } from "glob"
import _ from "lodash"
import { updateCodeData } from "./scripts/update-code-data/update-code-data"
import { organizeCodeData } from "./scripts/update-code-data/organize-code-data"
import { sortCodeData } from "./scripts/update-code-data/sort-code-data"
import redirects from "./redirects.json"

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})


const fetchData = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "GraphQL Conf / GraphQL Foundation",
      },
    })
    const data = await response.json()
    return data
  } catch (error) {
    throw new Error(
      `Error fetching data from ${url}: ${error.message || error.toString()}`
    )
  }
}

export const createPages: GatsbyNode["createPages"] = async ({
  actions,
  graphql,
}) => {
  const { createPage, createRedirect } = actions

  createRedirect({
    fromPath: `/conf/attendee/*`,
    toPath: `https://graphql-conf-attendee-nextjs.vercel.app/*`,
    statusCode: 200,
  })

  try {
    const schedAccessToken = process.env.SCHED_ACCESS_TOKEN

    const schedule: ScheduleSession[] = await fetchData(
      `https://graphqlconf2024.sched.com/api/session/list?api_key=${schedAccessToken}&format=json`
    )

    const usernames: { username: string }[] = await fetchData(
      `https://graphqlconf2024.sched.com/api/user/list?api_key=${schedAccessToken}&format=json&fields=username`
    )

    // Fetch full info of each speaker individually and concurrently
    const speakers = (
      (await Promise.all(
        usernames.map(async user => {
          await new Promise(resolve => setTimeout(resolve, 2000)) // 2 second delay between requests, rate limit is 30req/min
          return fetchData(
            `https://graphqlconf2024.sched.com/api/user/get?api_key=${schedAccessToken}&by=username&term=${user.username}&format=json&fields=username,company,position,name,about,location,url,avatar,role,socialurls`
          )
        })
      )) as SchedSpeaker[]
    ).filter(s => s.role.includes("speaker"))

    // Create schedule events' pages
    schedule.forEach(event => {
      const eventSpeakers = speakers.filter(e =>
        event.speakers?.includes(e.name)
      )

      if (!process.env.GATSBY_CLOUD && !process.env.GITHUB_ACTIONS) {
        try {
          createOpenGraphImage(createPage, {
            outputDir: "../static/img/__og-image",
            component: path.resolve("./src/templates/EventOgImageTemplate.tsx"),
            size: {
              width: 1200,
              height: 630,
            },
            waitCondition: "networkidle0",
            context: {
              id: event.id,
              title: event.name,
              event,
              speakers: eventSpeakers,
            },
          })
        } catch {
          console.log("Error creating OG image for", event.name)
        }
      }
    })

    // Create a page for each speaker
    speakers.forEach(speaker => {
      const speakerSessions: ScheduleSession[] =
        schedule.filter(session => session.speakers?.includes(speaker.name)) ||
        []

      if (!process.env.GATSBY_CLOUD && !process.env.GITHUB_ACTIONS) {
        try {
          createOpenGraphImage(createPage, {
            outputDir: "../static/img/__og-image",
            component: path.resolve(
              "./src/templates/SpeakerOgImageTemplate.tsx"
            ),
            size: {
              width: 1200,
              height: 630,
            },
            waitCondition: "networkidle0",
            context: {
              id: speaker.username,
              title: speaker.name,
              speaker,
            },
          })
        } catch {
          console.log("Error creating OG image for speaker ", speaker.name)
        }
      }
    })
  } catch (error) {
    console.log("CATCH ME:", error)
  }
}
