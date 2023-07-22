import React, { FC } from "react"
import FooterConf from "../components/Conf/Footer"
import HeaderConf from "../components/Conf/Header"
import LayoutConf from "../components/Conf/Layout"
import SeoConf from "../components/Conf/Seo"
import { PageProps } from "gatsby"
import ScheduleList from "../components/Conf/Schedule/ScheduleList"

export const eventsColors = [
  ["breaks", "#fffc5c"],
  ["keynote", "#42a1cd"],
  ["lightning", "#3db847"],
  ["presentations", "#d64292"],
  ["workshops", "#f3a149"],
]

const ScheduleTemplate: FC<PageProps<{}, { schedule: any }>> = ({
  pageContext: { schedule },
}) => {
  return (
    <LayoutConf>
      <HeaderConf />

      <div className="bg-white">
        <div className="prose lg:prose-lg mx-auto py-10 max-sm:px-4 override-prose-w-with-85ch">
          <h1>GraphQLConf 2023 Schedule</h1>
          <section className="px-0 my-8">
            <h4>September 19-21, 2023 I San Francisco Bay Area, CA</h4>
            <p>
              Please note: All session times are in Pacific Daylight Time (UTC
              -7). To view the schedule in your <b>preferred&nbsp;timezone</b>,
              please select from the drop-down menu to the right, above “Filter
              by Date.”
            </p>
            <p>
              <b>IMPORTANT NOTE:</b> Timing of sessions and room locations are{" "}
              <b>subject to change</b>.
            </p>

            <div className="flex lg:flex-row flex-col items-start mt-8 text-[#111827]">
              <span className="font-medium text-2xl lg:mr-4 lg:mb-0 mb-4 whitespace-nowrap">
                Event Types:
              </span>
              <div className="flex gap-2.5 w-full flex-wrap">
                {eventsColors.map(([event, color]) => (
                  <div className="flex items-center">
                    <div
                      className="w-6 h-6 rounded-full mr-2 border border-solid border-gray-200"
                      style={{ background: color }}
                    />
                    <span>{event}</span>
                  </div>
                ))}
              </div>
            </div>
            <ScheduleList scheduleData={schedule} />
          </section>
        </div>
      </div>
      <FooterConf includePartners={false} includeSponors={false} />
    </LayoutConf>
  )
}

export function Head() {
  return <SeoConf title="GraphQLConf 2023 Schedule" />
}

export default ScheduleTemplate
