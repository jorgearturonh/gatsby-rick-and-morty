import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import Layout from "../components/layout"
import Seo from "../components/seo"
import * as styles from "../components/index.module.css"
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 5, // 5 minutos
      staleTime: 1000 * 60, // 1 minuto
      refetchOnWindowFocus: false, // No volver a buscar datos al enfocar la ventana
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <IndexPage />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

const IndexPage = () => {
  const [page, setPage] = React.useState(1) // Estado para la página actual
  const fetchCharacters = (page = 1) => {
    return fetch(`https://rickandmortyapi.com/api/character?page=${page}`).then(
      (res) => res.json()
    )
  }

  const { isLoading, error, data } = useQuery({
    queryKey: ["repoData", page], // Incluir el número de página en la clave de consulta
    queryFn: () => fetchCharacters(page),
  })

  const characters = data?.results || []
  const info = data?.info

  const goToNextPage = () => setPage((prevPage) => prevPage + 1)
  const goToPrevPage = () => setPage((prevPage) => Math.max(prevPage - 1, 1))

  return (
    <Layout>
      <div className={styles.textCenter}>
        <StaticImage
          src="https://repository-images.githubusercontent.com/120371205/b6740400-92d4-11ea-8a13-d5f6e0558e9b"
          loading="eager"
          width={64}
          quality={95}
          formats={["auto", "webp", "avif"]}
          alt=""
          style={{ marginBottom: `var(--space-3)` }}
        />
        <h1>
          Welcome to <b>Rick & Morty</b>
        </h1>
      </div>
      <div>
        <div className={styles.paginationContainer}>
          {info?.prev && (
            <button className={styles.button} onClick={goToPrevPage}>
              Página Anterior
            </button>
          )}
          {info?.next && (
            <button className={styles.button} onClick={goToNextPage}>
              Página Siguiente
            </button>
          )}
        </div>

        <p>
          Página {page} de {info?.pages}
        </p>
      </div>
      <ul className={styles.list}>
        {isLoading && <div>Cargando...</div>}

        {!isLoading && error && <div>Error: {error.message}</div>}

        {!error &&
          !isLoading &&
          characters.map((character) => (
            <li key={character.id} className={styles.listItem}>
              <img
                src={character.image}
                alt={character.name}
                style={{ width: 100, height: 100 }}
              />
              <h2>{character.name}</h2>
              <p>{`${character.status} - ${character.species} - ${character.gender}`}</p>
              <a className={styles.listItemLink} href={character.url}>
                Ver perfil
              </a>
            </li>
          ))}
      </ul>
    </Layout>
  )
}
/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Home" />

export default App
