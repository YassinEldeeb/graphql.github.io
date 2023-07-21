import React, { FC } from "react"
import FooterConf from "../components/Conf/Footer"
import HeaderConf from "../components/Conf/Header"
import LayoutConf from "../components/Conf/Layout"
import SeoConf from "../components/Conf/Seo"
import { PageProps } from "gatsby"
import { SchedSpeaker } from "../components/Conf/Speakers/Speaker"
import ScheduleList from "../components/Conf/Schedule/ScheduleList"
import { Avatar } from "../components/Conf/Speakers/Avatar"
import { ReactComponent as TwitterIcon } from "../../static/img/logos/twitter.svg"
import { ReactComponent as FacebookIcon } from "../../static/img/logos/facebook.svg"
import { ReactComponent as InstagramIcon } from "../../static/img/logos/instagram.svg"
import { ReactComponent as SnapChatIcon } from "../../static/img/logos/snapchat.svg"
import { ReactComponent as LinkedinIcon } from "../../static/img/logos/linkedin.svg"

type SocialMediaIconServiceType =
  | "twitter"
  | "linkedin"
  | "facebook"
  | "instagram"
  | "snapchat"

const SocialMediaIcon = ({
  service,
}: {
  service: SocialMediaIconServiceType
}) => {
  switch (service) {
    case "twitter":
      return <TwitterIcon fill="#1C96E9" className="w-6 h-6 lg:w-7 lg:h-7" />
    case "linkedin":
      return <LinkedinIcon className="w-6 h-6 lg:w-7 lg:h-7" />
    case "facebook":
      return <FacebookIcon className="w-6 h-6 lg:w-7 lg:h-7" />
    case "instagram":
      return <InstagramIcon className="w-6 h-6 lg:w-7 lg:h-7" />
    case "snapchat":
      return <SnapChatIcon className="w-6 h-6 lg:w-7 lg:h-7" />
    default:
      return null
  }
}

const SpeakersTemplate: FC<
  PageProps<{}, { speaker: SchedSpeaker; schedule: any }>
> = ({ pageContext: { schedule, speaker } }) => {
  console.log("whatsap?", speaker)
  return (
    <LayoutConf>
      <HeaderConf />

      <div className="bg-white py-10">
        <section className="text-[#333333] min-h-[80vh] flex-col mx-auto max-sm:px-4 px-0 lg:justify-between justify-center max-w-[1100px]">
          <>
            <div className="flex flex-col lg:px-0">
              <a
                href="/conf/speakers"
                className="w-max rounded-md border-2 border-[#333333] border-solid py-2.5 px-5 cursor-pointer hover:opacity-80 transition-all hover:underline text-[#333333]"
              >
                <span>← Back to Speakers</span>
              </a>
              <div className="mt-16 flex lg:flex-row flex-col gap-10">
                <Avatar
                  className="w-[300px] h-[300px] rounded-full border-solid border-2 border-gray-300"
                  avatar={speaker.avatar}
                  name={speaker.name}
                />

                <div>
                  <h2 className="text-[40px] font-bold mt-5">{speaker.name}</h2>
                  <div className="mt-3 font-medium">
                    {renderPositionAndCompany(speaker)}
                  </div>
                  <p
                    className="leading-8"
                    dangerouslySetInnerHTML={{ __html: speaker.about }}
                  />
                </div>

                {speaker.socialurls && (
                  <div className="mt-0 text-[#333333]">
                    <h3 className="lg:text-[28px] text-2xl font-medium lg:my-5 mb-6 mt-0 whitespace-nowrap">
                      Connect With Me:
                    </h3>
                    {speaker.socialurls.map(social => (
                      <a
                        key={social.url}
                        href={social.url}
                        target="_blank"
                        className="flex items-center text-[#333333] w-max mb-3"
                      >
                        <SocialMediaIcon
                          service={
                            social.service.toLowerCase() as SocialMediaIconServiceType
                          }
                        />
                        <span className="lg:text-xl text-lg ml-1">
                          /
                          {social.url
                            .replace(/\/+$/, "")
                            .split("/")
                            .reverse()[0]
                            .toLowerCase()}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:mt-14 mt-10">
              <h2 className="text-2xl font-medium mb-9 mt-0">
                My Speakers Sessions
              </h2>
              {speaker && (
                <ScheduleList
                  scheduleData={schedule}
                  filterSchedule={sessions =>
                    sessions.filter(session =>
                      session.speakers?.includes(speaker?.name)
                    )
                  }
                />
              )}
            </div>
          </>
        </section>
      </div>

      <FooterConf includePartners={false} includeSponors={false} />
    </LayoutConf>
  )
}

export default SpeakersTemplate

export function Head() {
  return <SeoConf title="GraphQLConf 2023 Speaker" />
}

function renderPositionAndCompany(speaker: SchedSpeaker) {
  // Reassign "-" if position or company are undefined
  const position = speaker.position || "-"
  const company = speaker.company || "-"

  // Only include anchor element if url is not an empty string
  const companyElement =
    speaker.url !== "" ? (
      <a
        target="_blank"
        className="text-[#333333] underline"
        href={speaker.url}
      >
        {company}
      </a>
    ) : (
      company
    )

  if (position !== "-" && company !== "-") {
    return (
      <>
        {position} at {companyElement}
      </>
    )
  } else if (position !== "-") {
    return position
  } else if (company !== "-") {
    return <>Works at {companyElement}</>
  } else {
    return "-"
  }
}
