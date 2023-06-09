import api from '../../../utils/api'
/* Import from React */
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

/* Styles */
import styles from './PetDetails.module.css'

/* Owner Hooks */
import useFlashMessage from '../../../hooks/useFlashMessage'

function PetDetails() {
    const [pet, setPet] = useState({})
    const { id } = useParams()
    const { setFlashMessage } = useFlashMessage()
    const [token] = useState(localStorage.getItem('token') || '')

    useEffect(() => {
        api.get(`/pets/${id}`).then((response) => {
            setPet(response.data.pet)
        });
    }, [id]);

    async function schedule() {
        let msgType = 'success'

        const data = await api.patch(`pets/schedule/${pet._id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            return response.data
        }).catch((err) => {
            msgType = 'error'
            return err.response.data
        });

        setFlashMessage(data.message, msgType)
    };

    return (
        <>
            {pet.name && (
                <section className={styles.pet_details_container}>
                    <div className={styles.petdetails_header}>
                        <h1>Conhecendo o Pet: {pet.name}</h1>
                        <p>Se tiver interesse, marque uma visita para conhecê-lo</p>
                    </div>
                    <div className={styles.pet_images}>
                        {pet.images.map((image, index) => (
                            <img
                                src={`https://cute-tan-katydid-wear.cyclic.app/images/pets/${image}`}
                                alt={pet.name}
                                key={index}
                            />
                        ))}
                    </div>
                    <p>
                        <span className="bold">Peso:</span> {pet.weight}kg
                    </p>
                    <p>
                        <span className="bold">Idade:</span> {pet.age} anos
                    </p>
                    {token ? (
                        <button onClick={schedule}>Solicitar uma visita</button>
                    ) : (
                        <p>Você precisa <Link to='/register'>criar uma conta</Link> para solicitar uma visita</p>
                    )}
                </section>
            )}
        </>
    )
}

export default PetDetails