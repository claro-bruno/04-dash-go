import { Flex, Button, Stack } from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { Input } from '../components/Form/Input'
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

type SignInFormData = {
  email: string
  password: string
}

const signInFormSchema = yup.object().shape({
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  password: yup.string().required('Senha obrigatória'),
})

export default function SignIn() {
  const { signIn } = useContext(AuthContext)
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignInFormData>({
    resolver: yupResolver(signInFormSchema),
  })

  const handleSignIn: SubmitHandler<SignInFormData> = async ({
    email,
    password,
  }: SignInFormData) => {
    // await new Promise((resolve) => setTimeout(resolve, 2000))
    await signIn({ email, password })
  }
  // async function handleSignIn(data: SignInFormData) {
  //   await new Promise((resolve) => setTimeout(resolve, 2000))
  //   console.log(data)
  // }

  return (
    <Flex w="100vw" h="100vh" align="center" justify="center">
      <Flex
        as="form"
        width="100%"
        maxWidth={360}
        bg="gray.800"
        p="8"
        borderRadius={8}
        flexDir="column"
        onSubmit={handleSubmit(handleSignIn)}
      >
        <Stack spacing="4">
          <Input
            type="email"
            label="E-mail"
            error={errors.email}
            {...register('email')}
          />
          <Input
            // name="password"
            type="password"
            label="Senha"
            error={errors.password}
            {...register('password')}
          />
        </Stack>

        <Button
          type="submit"
          mt="6"
          colorScheme="pink"
          size="lg"
          isLoading={isSubmitting}
        >
          Entrar
        </Button>
      </Flex>
    </Flex>
  )
}
