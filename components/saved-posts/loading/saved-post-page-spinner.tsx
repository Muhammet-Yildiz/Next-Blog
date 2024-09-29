export const SavedPostPageSpinner = () => {
    return (
        <div className='flex justify-center items-center h-[470px] '>
        <div
          className="inline-block h-7 w-7 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-violet-500 motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status">
          <span
            className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
          >Loadings...</span >
        </div>
      </div>
    )

}