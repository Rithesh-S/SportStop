import React ,{ useState } from 'react'
import { useForm } from 'react-hook-form';
import { Link, useNavigate} from 'react-router-dom'
import { TextField, Button, Box, FormControl, Input, InputAdornment, InputLabel, IconButton} from '@mui/material';
import { Visibility, VisibilityOff, AccountCircle } from '@mui/icons-material'

function Login() {

    const [showPassword, setShowPassword] = useState(false);
    const [loading,setLoading] = useState(false)
    const [message, setMessage] = useState("Loading...")
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };

    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = data => {
        setLoading(true)
        setMessage("Loading...")
        fetch("http://localhost:1111/login",{
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ username: data.username , password: data.password})
        })
        .then(res => { 
            if(res.status === 401) {
                setMessage("Wrong Credentials!")
            }
            else if(res.status === 200) {
                setMessage("Login Successful!")
            }
            return res.json()
        })
        .then(data => {
            localStorage.setItem('token',data.token)
            localStorage.setItem('userid',data.userid)
            setTimeout(() => {
                setLoading(false)
                navigate('/auth')
            }, 1000);
        })
        .catch(err => console.error(err))
    }

  return (
    <>
            <section className="h-dvh bg-[url('./assets/login_background.jpg')] bg-center bg-cover relative bg-no-repeat text-[#f0f0f0]">
                { loading && 
                     <div className='absolute h-24 rounded-md z-10 px-16 bg-[#b0fd904c] flex justify-center items-center right-0 m-8'>
                        <p className='text-lg'>{message}</p>
                     </div>
                }
                <div className='flex flex-col h-full backdrop-blur-lg md:backdrop-blur-sm'>
                    <div className='h-fit flex p-6 items-center md:hidden'>
                        <p className='flex-1 text-center text-xl font-medium cursor-default'>Sports Stop</p>
                    </div>
                    <div className='flex-1 flex flex-col px-4 items-center'>
                        <div className='bg-[#faf9f6] p-4 pt-6 mb-auto md:my-auto md:w-1/2 lg:w-2/5 rounded-md text-black'>
                            <p className='text-4xl text-center tracking-wider cursor-default'>Welcome</p>
                            <p className='p-2 tracking-wide text-center cursor-default'>All Sport Needs, One Stop</p>
                            <form onSubmit={handleSubmit(onSubmit)} className='text-black flex flex-col space-y-4 p-4'>
                                <div>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                        <TextField fullWidth id="input-with-sx" label="Username" variant="standard" color={'success'} error={errors.username}
                                        {...register('username', {
                                            required: 'Username is required!', 
                                        })}
                                        />
                                    </Box>
                                    {errors.username && <p className='text-sm pt-1 text-red-500'>{errors.username.message}</p>}
                                </div>
                                <FormControl fullWidth variant="standard" color='success' error={errors.password}>
                                    <InputLabel htmlFor="standard-adornment-password" >Password</InputLabel>
                                    <Input
                                        id="standard-adornment-password"
                                        type={showPassword ? 'text' : 'password'}
                                        {...register('password', { 
                                            required: 'Password is required!' })}
                                        endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                            onClick={() => setShowPassword(prev => !prev)}
                                            onMouseDown={handleMouseDownPassword}
                                            >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                        }
                                    />
                                    {errors.password && <p className='text-sm pt-1 text-red-500'>{errors.password.message}</p>} 
                                </FormControl>
                                <button>
                                    <Button variant="contained" color='success' disableElevation className='w-full cursor-pointer'>Login</Button>
                                </button>
                                <div className='w-full flex text-sm justify-evenly md:px-4 md:justify-between'>
                                    <p className='cursor-pointer italic transition-all duration-300 hover:text-emerald-600'><Link to='/forgot_password'>Forgot Password</Link></p>
                                    <p className='md:hidden'>|</p>
                                    <p className='cursor-pointer italic transition-all duration-300 hover:text-emerald-600'><Link to='/register'>Register</Link></p>
                                </div>
                            </form>
                        </div>
                        <div className='cursor-default h-fit text-xs p-2 text-black'>
                            <p>By continuing, You agree to the Terms of Use. Read our <span className='underline italic hover:text-emerald-900 transition-all duration-300'>Privacy Policy.</span></p>
                        </div>
                    </div>
                </div>
            </section>
    </>
  )
}

export default Login