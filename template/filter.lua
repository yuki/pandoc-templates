function parse_size(size)
  -- to parse width and height
  size = string.gsub(size,"(%%)", "")
  -- convert height XY% into 0.XY
  size = tonumber(size)
  if (size == nil) then
    size = 100.0
  end
  return size / 100.0
end

if FORMAT:match 'latex' then

  function Span(el)
    beg_v = ""

    if el.classes[1] == "part" then
      beg_v = "\\part{"
    elseif el.classes[1] == "inlineconsole" then
      beg_v = "\\inlineconsole{"
    elseif el.classes[1] == "commandbox" then
      beg_v = "\\commandbox{"
    elseif el.classes[1] == "configfile" then
      beg_v = "\\configfile{"
    elseif el.classes[1] == "configdir" then
      beg_v = "\\configdir{"
    elseif el.classes[1] == "configlink" then
      beg_v = "\\configlink{"
    elseif el.classes[1] == "movie" then
      beg_v = "\\movie{"..el.c[1].target.."}{"
    elseif el.classes[1] == "footnotesize" then
      beg_v = "\\footnotesize{"
    end

    if (beg_v == nil or beg_v == "") then
      -- COLORS
      color = el.attributes['color']
      -- if no color attribute, return unchanged
      if color == nil then return el end

        -- remove color attributes
        el.attributes['color'] = nil
        -- encapsulate in latex code
        table.insert(
          el.content, 1,
          pandoc.RawInline('latex', '\\textcolor{'..color..'}{')
        )
        table.insert(
          el.content,
          pandoc.RawInline('latex', '}')
        )
        return el.content
    else
      return pandoc.RawInline("latex", beg_v..pandoc.utils.stringify(el).."}")
    end
  end

  function Figure(el)
    -- if figure's child is a RawInline is because it has changed in Image
    if el.c[1].c[1].t == "RawInline" then
      return el.c[1].c[1]
    end
  end

  function Div(el)
    beg_v = ""
    end_v = ""

    -- para las customboxes
    if el.classes[1] == "infobox" then
      beg_v = "\\begin{infobox}"
      end_v = "\\end{infobox}"
    elseif el.classes[1] == "warnbox" then
      beg_v = "\\begin{warnbox}"
      end_v = "\\end{warnbox}"
    elseif el.classes[1] == "errorbox" then
      beg_v = "\\begin{errorbox}"
      end_v = "\\end{errorbox}"
    elseif el.classes[1] == "questionbox" then
      beg_v = "\\begin{questionbox}"
      end_v = "\\end{questionbox}"
    elseif el.classes[1] == "exercisebox" then
      beg_v = "\\begin{exercisebox}"
      end_v = "\\end{exercisebox}"
    elseif el.classes[1] == "center" then
      beg_v = "\\begin{center}"
      end_v = "\\end{center}"
    elseif el.classes[1] == 'column' then
      -- FOR COLUMNS
      -- https://superuser.com/questions/1682413/two-columns-pdf-from-markdown-with-pandoc-and-lua-script
      local width = parse_size(el.attributes.width)
      beg_v = pandoc.List:new{pandoc.RawBlock("latex", '\\begin{minipage}{'..width..'\\linewidth}\n\\setlength{\\parskip}{1.2em}')}
      end_v = pandoc.List:new{pandoc.RawBlock("latex", "\\end{minipage}")}
      return beg_v .. el.content .. end_v
    elseif el.classes[1] == 'columns' then
      -- FOR COLUMNS
      -- https://superuser.com/questions/1682413/two-columns-pdf-from-markdown-with-pandoc-and-lua-script
      -- merge two consecutives RawBlocks (\end... and \begin...)
      -- to get rid of the extra blank line
      local blocks = el.content
      local rbtxt = ''
  
      for i = #blocks-1, 1, -1 do
        if i > 1 and blocks[i].tag == 'RawBlock' and blocks[i].text:match 'end' and blocks[i+1].tag == 'RawBlock' and blocks[i+1].text:match 'begin' then
          -- added \hfill for the space between
          rbtxt = blocks[i].text .."\\hfill".. blocks[i+1].text
          blocks:remove(i+1)
          blocks[i].text = rbtxt
        end
      end
      return blocks
    elseif el.classes[1] == "mycode" then
      title = pandoc.utils.stringify(el.c[1])
      language = pandoc.utils.stringify(el.c[2].attr.classes)
      if (el.attributes["size"]) then
        size = el.attributes.size
      else
        size = "normalsize"
      end

      code = el.c[2].text
      -- get mycode block's title
      return pandoc.RawBlock('latex', "\\begin{mycode}{"..title.."}{"..language.."}{\\"..size.."}\n"..code.."\n\\end{mycode}")
    end

    table.insert(el.content, 1, pandoc.RawInline("latex", beg_v))
    table.insert(el.content, pandoc.RawInline("latex", end_v))
    return el
  end

  function Image(el)
    local options = {}

    local caption = ""
    -- Procesar cada elemento del caption para manejar texto y enlaces
    for _, e in ipairs(el.caption) do
      if e.t == "Str" then
        caption = caption .. e.text
      elseif e.t == "Link" then
        local linkText = pandoc.utils.stringify(e.content)
        local url = e.target
        caption = caption .. string.format("\\href{%s}{%s}", url, linkText)
      elseif e.t == "Space" then
        caption = caption .. " "
      elseif e.t == "Strong" then
        local strongText = pandoc.utils.stringify(e.content)
        caption = caption .. string.format("\\textbf{%s}", strongText)
      elseif e.t == "Emph" then
        local strongText = pandoc.utils.stringify(e.content)
        caption = caption .. string.format("\\textit{%s}", strongText)
      elseif e.t == "Quoted" then
        local quotedText = pandoc.utils.stringify(e.content)
        caption = caption .. "``" ..quotedText .."\'' "
      end
    end

    -- width = el.attributes.width
    if (el.attributes.width) then
      width = parse_size(el.attributes.width)
      table.insert(options,string.format("width=%s\\linewidth",string.format("%f", width)))
    end
    
    -- height = el.attributes.height
    if (el.attributes.height) then
      -- I don't use pecentages with the height
      table.insert(options,string.format("height=%s",string.format(el.attributes.height)))
    end

    local framed = ""
    if (el.attributes.framed) then
      framed = "frame"
      table.insert(options,framed)
    end

    local includefile = "includegraphics"
    if (string.sub(el.src,-3) == "svg") then
      includefile = "includesvg"
    end

    beg_v = "\\begin{center} "
    end_v = "\\end{center}"

    if (el.attributes.inline) then
      beg_v = ""
      end_v = ""
    end

    if (caption == "" or caption == " ") then
      latexstring = string.format(beg_v.." \\%s[%s]{%s} " ..end_v,includefile,table.concat(options,","),el.src)
    else
      latexstring = string.format(beg_v.." \\%s[%s]{%s} \\captionof{figure}{%s} " ..end_v ,includefile,table.concat(options,","),el.src,caption)
    end
    return pandoc.RawInline("latex", latexstring)
  end

end

-- when parsing to HTML
if FORMAT:match 'html' then
  function Span(el)
    color = el.attributes['color']
    -- if no color attribute, return unchanged
    if color == nil then return el end

    -- transform to <span style="color: red;"></span>
      -- remove color attributes
      el.attributes['color'] = nil
      -- use style attribute instead
      el.attributes['style'] = 'color: ' .. color .. ';'
      -- return full span element
      return el
  end

  function CodeBlock(block)
    lang = block.classes[1]
    code = block.text
    filename = "pygmentize.txt"

    file = io.open(filename, "w")
    file:write(code)
    file:close()


    cmd = string.format('pygmentize -l %s -f %s < %s', lang, 'html',filename)
    local proceso = io.popen(cmd, "r") -- Abre el archivo en modo de lectura
    local output = proceso:read('*a')
    proceso:close()
    os.remove(filename)

    texto = '<div class="sourceCode">'..output..'</div>'
    return pandoc.RawBlock('html',texto)
  end
end
