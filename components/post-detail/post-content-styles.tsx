import { DMSans, montserrat } from "@/lib/fonts";
import { EditorJsContent } from "@/types";
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
export const textFormatStyles  = {
    paragraph: {
        fontSize: '17px',
        lineHeight: '32px',
        fontFamily: DMSans.style.fontFamily,
        letterSpacing: '0.2px',
        marginBottom :'1.4rem',
        marginTop:'1.4rem',
    },
    header: {
        h2: {
            fontSize: '1.25rem',
            margin: '2.5rem 0 2.5rem 0',
            fontFamily: montserrat.style.fontFamily,
        },
        h3: {
            fontSize: '1.22rem',
            fontWeight: 'bold',
            margin: '2.5rem 0 2.5rem 0',
            fontFamily: montserrat.style.fontFamily,
        },
        h4: {
            fontSize: '1.18rem',
            fontWeight: 'bold',
            margin: '2.5rem 0 2.5rem 0',
            fontFamily: montserrat.style.fontFamily,
        },
        h5: {
            fontSize: '1.14rem',
            fontWeight: 'bold',
            fontFamily: montserrat.style.fontFamily,
            margin: '2.5rem 0 2.5rem 0',
        },

    },
    quote: {
        container: {
            borderLeft: '5px solid #D2C0F7',
            margin: '3rem 0',
        },
        content: {
            fontSize: '1.2rem',
            fontStyle: 'italic',
            color: '#666',
            paddingLeft :'2rem'
        },
        author: {
            fontSize: '0.95rem',
            fontWeight: 'bold',
            marginTop: '0.5rem',
            display :'none'
        },
        message: {
            fontSize: '1rem',
        },
    },
    list: {
        container: {
            margin: '1rem 0',
        },
        listItem: {
            margin: '0.5rem 0',
            listStylePosition: 'inside',
            paddingLeft: '1rem',
            fontSize: '17px',
            lineHeight: '32px',
            fontFamily: DMSans.style.fontFamily,
        },
    },
    checklist: {
        container: {
            margin: '1.5rem 0',
        },
        item: {
            margin: '0.5rem 0',
        },
        checkbox: {
            margin: '0.5rem 0',
        },
        label: {
            listStylePosition: 'inside',
            paddingLeft: '1rem',
            fontSize: '17px',
            lineHeight: '32px',
            fontFamily: DMSans.style.fontFamily,
        },
    },
    delimiter :{
            container: {
                margin :'3.4rem 0',
            }
    },
    image : {
        figure: {
          border :'2px solid red'
        }
    }
   
}


export function filterParagraphBlocks(content: EditorJsContent) {
    const filteredBlocks = content.blocks.filter(block => block.type === 'paragraph');
  
    return {
      time: content.time,
      blocks: filteredBlocks,
      version: content.version
    };
  }
  

export const CustomParagraph = (props: any) => {
    const content = props.data.text;
    const isEmpty = !content || content.trim().length === 0;

    return (
        <p
            {...props.attributes}
            className={` ${isEmpty ? 'min-h-[1em]' : ''}`}
            style={props.style}
        >
            {isEmpty ? <span>&nbsp;</span> : <span  dangerouslySetInnerHTML={{ __html: content }} />}
        </p>
    );
};

export const CustomImage = ({ data }: any) => {
    return (
        <figure
            style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '2.7rem 0px',
                width: '100%',
                maxWidth: '100%',
                maxHeight: '400px',
                overflow: 'hidden',
                border: 'none',
            }}
        >
            <Zoom>
                <img
                    src={data.file.url}
                    alt={data.caption || 'image'}
                    style={{
                        maxWidth: '100%',
                        maxHeight: '400px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                    }}
                />
            </Zoom>
        </figure>
    );
};