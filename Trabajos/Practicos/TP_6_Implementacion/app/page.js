import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import React from 'react'

const group5 = [
  { id: '90236', name: 'Martín Boris', github: 'Mart2202' },
  { id: '90618', name: 'Santiago Avendaño', github: 'Santi-Avendano' },
  { id: '90318', name: 'Juan Pedro Roldan', github: 'juanro03' },
  { id: '89772', name: 'Tomás Malamud', github: 'TomiMalamud' },
  { id: '89074', name: 'Juan Francisco Márquez', github: 'juanfmarquez' },
  { id: '86103', name: 'Juan Ignacio Taliani', github: 'JuanIgnacioTaliani' },
  { id: '86694', name: 'Eliseo Dávila Pellegrino', github: 'eliseodavila' }
]

const StudentCard = ({ id, name, github }) => (
  <a href={`https://github.com/${github}`} target='blank'>
    <div className='bg-gray-100 rounded-lg p-4 mb-2 shadow-sm hover:bg-gray-200/90'>
      <span className='font-mono text-gray-600 mr-5'>{id}</span>
      <span className='font-normal'>{name}</span>
    </div>
  </a>
)

const Home = () => {
  return (
    <div className='mt-4 mx-auto'>
      <h3 className='text-xl font-bold text-gray-800'>
        Ingeniería y Calidad de Software
      </h3>
      <p className='text-gray-600 mt-2'>
        Universidad Tecnológica Nacional | FRC
      </p>

      <div className='flex items-center text-center my-8'>
        <a href='/quotes'>
          <Button variant='outline' className='text-center'>Ir al TP 6 - Tango App
            <ArrowRight className='h-4 w-4 ml-2' />
          </Button>
        </a>
      </div>
      <hr className='my-8' />
      <h1 className='text-center my-8 text-4xl font-light text-gray-700'>Grupo 5</h1>

      <div className='space-y-2'>
        {group5.map((student) => (
          <StudentCard key={student.id} {...student} />
        ))}
      </div>
    </div>
  )
}

export default Home
