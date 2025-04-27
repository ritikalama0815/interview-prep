import React from 'react'
import dayjs from 'dayjs'
import Image from 'next/image'; 
import { getRandomInterviewCover } from "@/lib/utils";
const Interviewcard = ({interviewId, userId, role,type, tectstack, createdAt} : InterviewCardProps) => {
    const feedback = null as Feedback | null;
    const normalizedType = /mix/gi.test(type)? "Mixed" : type;
    const formattedDate = dayjs(feedback?.createdAt || createdAt ||Date.now()).format('DD/MM/YYYY');
  return (
    <div className='card-border w-[360px] max-sm:w-full min-h-6'>
      <div className="card-interview">
        <div>
            <div className='absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600'>
                <p className='badge-text'>
                    {normalizedType}
                </p>
            </div>
            <Image src={getRandomInterviewCover()} alt="cover image" width={90} height={90} className='rounded-full object-fit size-[90px]'/>
        </div>
      </div>
    </div>
  )
}

export default Interviewcard
