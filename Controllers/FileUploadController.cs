using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.IO;
using System.Threading.Tasks;

namespace IngatlanokBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileUploadController : ControllerBase
    {
        private readonly string _ftpServer;
        private readonly string _ftpUser;
        private readonly string _ftpPassword;
        IWebHostEnvironment _env;

        public FileUploadController(IConfiguration configuration, IWebHostEnvironment env)
        {
            _ftpServer = configuration["Ftp:Server"];
            _ftpUser = configuration["Ftp:Username"];
            _ftpPassword = configuration["Ftp:Password"];
            _env = env;
        }

        [Route("FtpServer")]
        [HttpPost]
        public async Task<IActionResult> FileUploadFtp()
        {
            try
            {
                var httpRequest = Request.Form;
                var postedFile = httpRequest.Files[0];
                string fileName = postedFile.FileName;
                string subFolder = "/";

                var url = "ftp://ftp.nethely.hu" + subFolder + "/" + fileName;

                bool fileExists = false;
                try
                {
                    FtpWebRequest checkRequest = (FtpWebRequest)WebRequest.Create(url);
                    checkRequest.Credentials = new NetworkCredential("ingatlan", "Ingatlanok12345");
                    checkRequest.Method = WebRequestMethods.Ftp.GetFileSize;
                    using (FtpWebResponse response = (FtpWebResponse)checkRequest.GetResponse())
                    {
                        fileExists = true;
                    }
                }
                catch (WebException ex)
                {
                    if (((FtpWebResponse)ex.Response).StatusCode == FtpStatusCode.ActionNotTakenFileUnavailable)
                    {
                        fileExists = false;
                    }
                }

                FtpWebRequest request = (FtpWebRequest)WebRequest.Create(url);
                request.Credentials = new NetworkCredential("ingatlan", "Ingatlanok12345");
                request.Method = WebRequestMethods.Ftp.UploadFile;
                await using (Stream ftpStream = request.GetRequestStream())
                {
                    postedFile.CopyTo(ftpStream);
                }

                return Ok(fileName);
            }
            catch (Exception)
            {
                return Ok("default.jpg");
            }
        }
    }
}
