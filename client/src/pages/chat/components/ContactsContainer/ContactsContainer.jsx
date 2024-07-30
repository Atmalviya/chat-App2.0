import Logo from '@/assets/chaticon.svg'
import Chat from '@/assets/chaticon.svg'
import ProfileInfo from './ProfileInfo'
import NewDm from './NewDm'

const ContactsContainer = () => {
  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
        <div className="pt-3">
            <img src={Chat} alt="" className='h-14 mx-10' />
        </div>
        <div className="my-5">
            <div className="flex items-center justify-between pr-10">
                <Title text='Direct Messages' />
                <NewDm />
            </div>
        </div>
        <div className="my-5">
            <div className="flex items-center justify-between pr-10">
                <Title text='Channels' />
            </div>
        </div>
        <ProfileInfo />
    </div>
  )
}

const Title = ({text}) => {
    return (
        <h6 className='uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm'>{text}</h6>
    )
}

export default ContactsContainer;

