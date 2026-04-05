export default function BoardPage() {
    // const boardMessage = failedColumn
    // ? 'Could not load the board data.'
    // : hasLoadingColumn
    //   ? 'Loading task lists…'
    //   : actionError
  return (
      <main className="board-page">
              {/* {boardMessage ? ( */}
          <div
            className={`board-status board-status--error' }`}
          
          >
            {/* {boardMessage} */}
          </div>
        {/* ) : null} */}
      </main>
    
  )
}