
import Interviewcard from '@/components/InterviewCard'
import { Button } from '@/components/ui/button'
import { getCurrentUser, getInterViewByUserId, getLatestInterviews } from '@/lib/actions/auth.action'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Page =  async () => {
  const user = await getCurrentUser();

  const [userInterviews, latestInterviews] = await Promise.all([
    await getInterViewByUserId(user?.id!),
    await getLatestInterviews({userId: user?.id!})
  ]);

  const pastInterviews = userInterviews?.length >0;
  const futureInterviewd = latestInterviews?.length >0;
  return (
    <>
    <section className='card-cta'>
      <div className="flex flex-col gap-6 max-w-lg">
        <h2>Get interview ready.</h2>
        <p className='text-lg'>
          Get feedbacks on how you did your interview with AI powered interviewer, Yuegui
        </p>
        <Button asChild className='btn-primary max-sm:w-full'>
          <Link href="/interview"> Get started</Link>
        </Button>
      </div>

      <Image src="/robot.png" alt="robo-dude" width={400} height={400} className='max-sm:hidden'/>

    </section>

    <section className='flex flex-col gap-6 mt-8'>
      <h2>History</h2>
      <div className="interviews-section">
        {
          pastInterviews?(
            userInterviews?.map((interview)=>(
              <Interviewcard {...interview} key = {interview.id} />
            ))):(
            <p>No interviews yet.</p>
            )}
      </div>
    </section>

    <section className='flex flex-col gap-6 mt-8'>
      <h2>Take an interview.</h2>
      <div className="interviews-section">
      {
          futureInterviewd?(
            latestInterviews?.map((interview)=>(
              <Interviewcard {...interview} key = {interview.id} />
            ))):(
            <p>No interviews yet.</p>
            )}
      </div>
    </section>
    </>
  )
}

export default Page
